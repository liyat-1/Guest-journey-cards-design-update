import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, Pencil, Plus } from "lucide-react";
import { stageInsight, stageMetrics } from "@/components/ota/analytics";
import { property } from "@/components/ota/journey";
import { timingLabel } from "@/components/ota/stage-config";
import { useOta } from "@/components/ota/state";
import { useScale } from "@/components/ota/scale";
import { MessageEditor } from "@/components/ota/MessageEditor";
import { ExperienceEditor } from "@/components/ota/ExperienceEditor";
import { OfferDialog } from "@/components/ota/OfferDialog";
import { OfferShowcase } from "@/components/ota/OfferShowcase";
import { StagePreview } from "@/components/ota/StagePreview";
import { OpportunityCard } from "@/components/ota/OpportunityCard";
import { ReviewExperience } from "@/components/ota/ReviewExperience";
import { persona } from "@/components/ota/personality";
import { stageOpportunity } from "@/components/ota/opportunity";
import type { GuestSegmentId } from "@/components/ota/segments";
import { segmentShort, stageEntry } from "@/components/ota/segments";
import { Device, LandingRender, MessageRender, SuccessRender } from "@/components/ota/previews";
import { Btn, Chip, Metric, Panel, PanelHeader } from "@/components/ota/ui";

type Tab = "experience" | "performance";

const isTab = (v: unknown): v is Tab => v === "experience" || v === "performance";

export const Route = createFileRoute("/ota-buster/stage/$stageId")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } =>
    isTab(search["tab"]) ? { tab: search["tab"] } : {},
  head: () => ({
    meta: [
      { title: "Journey stage — OTA Buster | Directful" },
      {
        name: "description",
        content:
          "Edit the guest experience, attach an offer and read the performance of a single journey stage.",
      },
      { property: "og:title", content: "Journey stage — OTA Buster | Directful" },
      {
        property: "og:description",
        content: "Understand, edit, preview and optimise one journey stage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StageDetail,
});

const tabs: { id: Tab; label: string }[] = [
  { id: "experience", label: "Guest experience" },
  { id: "performance", label: "Offer & stage performance" },
];

/** A guest-facing screen: preview on the left, its own edit entry point. */
function ScreenCard({
  eyebrow,
  title,
  hint,
  onEdit,
  editLabel,
  onPreview,
  children,
}: {
  eyebrow: string;
  title: string;
  hint: string;
  onEdit: () => void;
  editLabel: string;
  onPreview: () => void;
  children: React.ReactNode;
}) {
  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader eyebrow={eyebrow} title={title} hint={hint} />
      <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-border">
        <div className="max-h-[420px] overflow-hidden">{children}</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Btn size="sm" onClick={onEdit}>
          <Pencil className="size-3.5" strokeWidth={2} /> {editLabel}
        </Btn>
        <Btn variant="secondary" size="sm" onClick={onPreview}>
          <Eye className="size-3.5" strokeWidth={2} /> Full preview
        </Btn>
      </div>
    </Panel>
  );
}

function StageDetail() {
  const { stages, configs } = useOta();
  const { stageId } = Route.useParams();
  const scale = useScale();
  const stage = stages.find((s) => s.id === stageId);
  const search = Route.useSearch();
  const [tab, setTab] = useState<Tab>(search.tab ?? "experience");
  const [edit, setEdit] = useState(false);
  const [screen, setScreen] = useState<"landing" | "success">("landing");
  const [screenEdit, setScreenEdit] = useState<null | "landing" | "success">(null);
  const [offerOpen, setOfferOpen] = useState(false);
  const [presetOffer, setPresetOffer] = useState<string | undefined>(undefined);
  const [presetSegment, setPresetSegment] = useState<GuestSegmentId | "all" | undefined>(undefined);
  const [preview, setPreview] = useState<null | "message" | "landing" | "success">(null);

  if (!stage) throw notFound();

  const config = configs[stage.id]!;
  const metrics = stageMetrics[stage.id] ?? [];
  const insight = stageInsight[stage.id];
  const entry = stageEntry[stage.id];
  const opportunity = stageOpportunity(stage.id);
  const index = stages.findIndex((s) => s.id === stage.id);
  const next = stages[index + 1];
  const prev = stages[index - 1];
  const isText = stage.message.channel === "Text";
  const look = persona(stage.id);
  const StageIcon = look.icon;

  const openOffer = (id?: string, segment?: GuestSegmentId | "all") => {
    setPresetOffer(id);
    setPresetSegment(segment);
    setOfferOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to="/ota-buster"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2.2} /> Guest journey
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-[12.5px] font-semibold text-foreground">{stage.name}</span>
      </div>

      <div className="premium-panel edge-sheen relative overflow-hidden p-5 sm:p-6">
        <span className={`absolute inset-y-0 left-0 w-[3px] ${look.rail}`} aria-hidden />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3.5">
            <span
              className={`mt-1 grid size-10 shrink-0 place-items-center rounded-xl ${look.tile}`}
            >
              <StageIcon className="size-[18px]" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold tracking-[0.12em] text-primary">
                  STAGE {stage.index}
                </span>
                <Chip>{isText ? "Text message" : "Email"}</Chip>
                <Chip tone="primary">{timingLabel(config.timing)}</Chip>
              </div>
              <h2 className="mt-2 font-serif text-[26px] leading-tight text-foreground">
                {stage.name}
              </h2>
              <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
                {stage.purpose}
              </p>
              {entry && (
                <p className="mt-2 text-[12.5px] text-muted-foreground">
                  <span className="font-semibold text-foreground">Audience:</span> {entry.who} ·{" "}
                  {entry.when.toLowerCase()}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn size="sm" variant="secondary" onClick={() => setPreview("message")}>
              <Eye className="size-4" strokeWidth={1.9} /> Preview
            </Btn>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 -mx-6 border-b border-border bg-background/90 px-6 backdrop-blur">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative shrink-0 px-3 py-3 text-[13px] font-semibold transition-colors ${
                tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              <span
                className={`absolute inset-x-2 bottom-0 h-[2px] rounded-full ${tab === t.id ? "bg-primary" : "bg-transparent"}`}
              />
            </button>
          ))}
        </div>
      </div>

      {tab === "experience" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <ScreenCard
            eyebrow={isText ? "Step 1 · Text message" : "Step 1 · Email"}
            title={isText ? "Text message" : stage.message.subject}
            hint={
              isText
                ? "Short, native to the channel — this is what arrives on the guest's phone."
                : stage.message.preheader
            }
            editLabel={isText ? "Edit text message" : "Edit email"}
            onEdit={() => setEdit(true)}
            onPreview={() => setPreview("message")}
          >
            <Device mode={isText ? "mobile" : "desktop"} chrome="mail">
              <MessageRender stage={stage} message={stage.message} />
            </Device>
          </ScreenCard>

          <Panel className="flex h-full flex-col">
            <PanelHeader
              eyebrow="Step 2 · Landing experience"
              title={screen === "landing" ? "Landing page" : "Confirmation"}
              hint={
                screen === "landing"
                  ? "Where the guest lands, including any offers you attached."
                  : "What the guest sees straight after completing the step."
              }
              action={
                <div className="flex rounded-lg border border-border bg-secondary/60 p-0.5">
                  {(["landing", "success"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setScreen(s)}
                      className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                        screen === s
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s === "landing" ? "Landing" : "Confirmation"}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-border">
              <div className="max-h-[420px] overflow-hidden">
                {screen === "landing" ? (
                  <LandingRender
                    stage={stage}
                    {...(config.formEnabled ? { formFields: config.fields } : {})}
                  />
                ) : (
                  <SuccessRender stage={stage} />
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Btn size="sm" onClick={() => setScreenEdit(screen)}>
                <Pencil className="size-3.5" strokeWidth={2} />
                Edit {screen === "landing" ? "landing page" : "confirmation"}
              </Btn>
              <Btn variant="secondary" size="sm" onClick={() => setPreview(screen)}>
                <Eye className="size-3.5" strokeWidth={2} /> Full preview
              </Btn>
            </div>
          </Panel>

          {stage.id === "post-checkout" && <ReviewExperience property={property} />}

          <Panel className="lg:col-span-2">
            <PanelHeader
              eyebrow="Step 3 · Offers"
              title={
                stage.offers.length > 0
                  ? `${stage.offers.length} offer${stage.offers.length > 1 ? "s" : ""} on the landing page`
                  : "No offer attached yet"
              }
              hint="One offer per guest segment. It renders inside the landing page, in context."
              action={
                <Btn size="sm" variant="secondary" onClick={() => openOffer()}>
                  <Plus className="size-3.5" strokeWidth={2.2} /> Add offer
                </Btn>
              }
            />
            {stage.offers.length > 0 ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {stage.offers.map((o) => (
                  <div key={`${o.segment}-${o.id}`} className="space-y-2">
                    <OfferShowcase
                      name={o.name}
                      type={o.type}
                      segment={o.segment}
                      terms={o.cap ?? `${o.cost} to the hotel`}
                      compact
                    />
                    <Btn
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => openOffer(o.id, o.segment)}
                    >
                      <Pencil className="size-3.5" strokeWidth={2} /> Edit offer ·{" "}
                      {segmentShort(o.segment)}
                    </Btn>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-border-strong px-4 py-8 text-center text-[13px] text-muted-foreground">
                Attach an offer and it appears here — and inside the landing page the guest opens.
              </p>
            )}
          </Panel>
        </div>
      )}

      {tab === "performance" && (
        <div className="space-y-5">
          {opportunity && (
            <OpportunityCard
              opportunity={opportunity}
              onAccept={() => openOffer(opportunity.offerId, opportunity.segmentId)}
              onReview={() => openOffer(undefined, opportunity.segmentId)}
            />
          )}

          <Panel>
            <PanelHeader
              eyebrow="Offer & stage performance"
              title="How this stage is performing"
              hint="Guests reached, engagement and the direct revenue this stage produced."
            />
            <div className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-4">
              {metrics.map((m) => (
                <Metric key={m.label} {...m} value={scale.value(m.value)} />
              ))}
            </div>
            {insight && (
              <p className="mt-4 border-t border-border pt-4 text-[12.5px] leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">What to optimise here.</span>{" "}
                {insight}
              </p>
            )}
          </Panel>

          {stage.offerResults.length > 0 && (
            <Panel>
              <PanelHeader
                title="Offer results in this stage"
                hint="Historical performance of every incentive tested here."
              />
              <div className="mt-4 space-y-2">
                {stage.offerResults.map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border px-4 py-3"
                  >
                    <p className="min-w-0 flex-1 text-[13.5px] font-semibold text-foreground">
                      {o.name}
                    </p>
                    <p className="text-[12.5px] text-muted-foreground">
                      {scale.count(o.conversions)} direct conversions · {scale.value(o.rate)}{" "}
                      conversion rate · {scale.value(o.revenue)} direct revenue
                    </p>
                    <Btn variant="ghost" size="sm" onClick={() => openOffer(o.id)}>
                      Use this offer
                    </Btn>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5">
        {prev ? (
          <Link
            to="/ota-buster/stage/$stageId"
            params={{ stageId: prev.id }}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" strokeWidth={2.2} /> {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to="/ota-buster/stage/$stageId"
            params={{ stageId: next.id }}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
          >
            {next.name} <ArrowRight className="size-3.5" strokeWidth={2.2} />
          </Link>
        )}
      </div>

      <MessageEditor key={`${stage.id}-editor`} stage={stage} open={edit} onOpenChange={setEdit} />
      {screenEdit && (
        <ExperienceEditor
          key={`${stage.id}-${screenEdit}`}
          stage={stage}
          screen={screenEdit}
          open
          onOpenChange={(v) => {
            if (!v) setScreenEdit(null);
          }}
        />
      )}
      <OfferDialog
        key={`${stage.id}-offer`}
        stage={stage}
        open={offerOpen}
        onOpenChange={(v) => {
          setOfferOpen(v);
          if (!v) {
            setPresetOffer(undefined);
            setPresetSegment(undefined);
          }
        }}
        {...(presetOffer ? { presetOfferId: presetOffer } : {})}
        {...(presetSegment ? { presetSegment } : {})}
      />

      {preview && (
        <StagePreview
          key={`${stage.id}-${preview}`}
          stage={stage}
          open
          initialStep={preview}
          onOpenChange={(v) => {
            if (!v) setPreview(null);
          }}
        />
      )}
    </div>
  );
}
