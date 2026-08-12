import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Eye,
  Info,
  Mail,
  MessageSquare,
  Tag,
} from "lucide-react";

import { useState } from "react";
import type { Stage } from "@/components/ota/journey";
import { segmentShort } from "@/components/ota/segments";
import { stageCardMetrics, stageJourneyPerformance } from "@/components/ota/analytics";
import { stageOpportunity } from "@/components/ota/opportunity";
import { OpportunityLine } from "@/components/ota/OpportunityCard";
import { persona } from "@/components/ota/personality";
import { timingAnchors, timingLabel, type TimingUnit } from "@/components/ota/stage-config";
import { useOta } from "@/components/ota/state";
import { useScale } from "@/components/ota/scale";
import { StagePreview } from "@/components/ota/StagePreview";
import { fill } from "@/components/ota/previews";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Btn, Chip, DataPoint, DeltaTag, Field, SectionHeading } from "@/components/ota/ui";

const title = "Guest journey — OTA Buster | Directful";
const description =
  "The OTA guest journey as one workspace: every stage, its timing, its offer and how it performs.";

export const Route = createFileRoute("/ota-buster/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JourneyPage,
});

/** Timing is editable straight from the journey — no need to open the stage. */
function TimingPill({ stageId, first }: { stageId: string; first?: boolean }) {
  const { configs, setTiming } = useOta();
  const timing = configs[stageId]?.timing;
  if (!timing) return null;

  return (
    <div className="relative flex justify-center py-3">
      {!first && (
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border-strong to-transparent" />
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="glass-bar relative inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-[11.5px] font-semibold text-muted-foreground shadow-card transition-all hover:-translate-y-px hover:border-primary/40 hover:text-primary hover:shadow-raise"
          >
            <Clock className="size-3" strokeWidth={2.2} />
            {timingLabel(timing)}
            <ChevronDown className="size-3 opacity-60" strokeWidth={2.2} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-[290px] rounded-2xl p-4 shadow-float">
          <p className="text-[12.5px] font-semibold text-foreground">When this stage is sent</p>
          <div className="mt-3 space-y-2.5">
            <label className="block">
              <span className="text-[11.5px] font-medium text-muted-foreground">Amount</span>
              <input
                type="number"
                min={0}
                value={timing.amount}
                onChange={(e) => setTiming(stageId, { ...timing, amount: Number(e.target.value) })}
                className="mt-1 h-9 w-full rounded-lg border border-input bg-card px-3 text-[13px] text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </label>
            <Field
              label="Unit"
              value={timing.unit}
              options={["minutes", "hours", "days"]}
              onChange={(v) => setTiming(stageId, { ...timing, unit: v as TimingUnit })}
            />
            <Field
              label="Relative to"
              value={timingAnchors.find((a) => a.id === timing.anchor)?.label ?? ""}
              options={timingAnchors.map((a) => a.label)}
              onChange={(v) => {
                const anchor = timingAnchors.find((a) => a.label === v);
                if (anchor) setTiming(stageId, { ...timing, anchor: anchor.id });
              }}
            />
            <p className="text-[12.5px] font-semibold text-foreground">→ {timingLabel(timing)}</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function StageCard({ stage, onPreview }: { stage: Stage; onPreview: () => void }) {
  const navigate = useNavigate();
  const scale = useScale();
  const isText = stage.message.channel === "Text";
  const look = persona(stage.id);
  const Icon = look.icon;
  const opportunity = stageOpportunity(stage.id);
  const metrics = stageCardMetrics[stage.id] ?? [];
  const perf = stageJourneyPerformance[stage.id];
  const open = () => navigate({ to: "/ota-buster/stage/$stageId", params: { stageId: stage.id } });

  // "14.5% engagement" → a confident number with a quiet label beneath it.
  const rateParts = perf ? scale.value(perf.rate).split(" ") : [];
  const rateValue = rateParts[0] ?? "";
  const rateLabel = rateParts.slice(1).join(" ") || "conversion rate";

  const line = fill(
    isText ? stage.message.body.split("\n\n")[0]! : stage.message.subject,
    stage.offers[0]?.name,
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter") open();
      }}
      className={`premium-panel edge-sheen group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float ${look.edge}`}
    >
      <span className={`absolute inset-y-0 left-0 w-[3px] ${look.rail}`} aria-hidden />
      <span
        className={`pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r to-transparent opacity-70 ${look.wash}`}
        aria-hidden
      />

      <div className="relative px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start gap-4">
          <span
            className={`grid size-10 shrink-0 place-items-center rounded-xl ${look.tile} shadow-card`}
          >
            <Icon className="size-[18px]" strokeWidth={2} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h3 className="text-[16px] font-semibold tracking-[-0.015em] text-foreground">
                {stage.name}
              </h3>
              <span
                className={`text-[10.5px] font-semibold tracking-[0.12em] uppercase ${look.ink}`}
              >
                {look.intent}
              </span>
              <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground">
                {isText ? (
                  <MessageSquare className="size-3" strokeWidth={2.2} />
                ) : (
                  <Mail className="size-3" strokeWidth={2.2} />
                )}
                {isText ? "Text" : "Email"}
              </span>
            </div>

            <p className="mt-1 line-clamp-1 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
              {line}
            </p>

            {/* Inline metadata — reads as a measurement strip, not five boxes. */}
            <dl className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
              {metrics.map((m) => (
                <div key={m.label} className="flex items-baseline gap-1.5">
                  <dt className="text-[11px] text-muted-foreground">{m.label}</dt>
                  <dd className="text-[13px] font-semibold text-foreground tabular-nums">
                    {scale.value(m.value)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {stage.offers.length > 0 ? (
                stage.offers.map((o) => (
                  <Chip key={`${o.segment}-${o.id}`} tone="gold">
                    <Tag className="size-3" strokeWidth={2.2} /> {o.name} · {segmentShort(o.segment)}
                  </Chip>
                ))
              ) : (
                <Chip>No offer attached</Chip>
              )}
            </div>
          </div>

          {/* Performance rides on the right edge: one confident number. */}
          <div className="hidden w-[168px] shrink-0 flex-col items-end gap-2 border-l border-border/70 pl-5 sm:flex">
            {perf && (
              <div className="text-right">
                <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {rateLabel}
                </p>
                <p className="mt-1 text-[28px] leading-none font-semibold tracking-[-0.03em] text-foreground tabular-nums">
                  {rateValue}
                </p>
                <p className="mt-1.5">
                  <DeltaTag delta={perf.delta} suffix="vs prev" />
                </p>
              </div>
            )}
            <div className="mt-1 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Btn
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onPreview();
                }}
              >
                <Eye className="size-3.5" strokeWidth={2} /> Preview
              </Btn>
              <Btn
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  open();
                }}
              >
                Open <ArrowRight className="size-3.5" strokeWidth={2.2} />
              </Btn>
            </div>
          </div>
        </div>

        {opportunity && (
          <OpportunityLine
            opportunity={opportunity}
            onView={() =>
              navigate({
                to: "/ota-buster/stage/$stageId",
                params: { stageId: stage.id },
                search: { tab: "performance" },
              })
            }
          />
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4 sm:hidden">
          <Btn
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              open();
            }}
          >
            Open stage <ArrowRight className="size-3.5" strokeWidth={2.2} />
          </Btn>
          <Btn
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              onPreview();
            }}
          >
            <Eye className="size-3.5" strokeWidth={2} /> Preview
          </Btn>
        </div>
      </div>
    </div>
  );
}

function JourneyPage() {
  const { stages } = useOta();
  const [showRules, setShowRules] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewStage = stages.find((s) => s.id === previewId);

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Guest journey"
        subtitle="Every stage a guest moves through. Adjust the timing here, or open a stage to edit the guest experience, its offer and its conditions."
      />

      <div className="mx-auto w-full max-w-[920px]">
        {stages.map((s, i) => (
          <div key={s.id}>
            <TimingPill stageId={s.id} first={i === 0} />
            <StageCard stage={s} onPreview={() => setPreviewId(s.id)} />
          </div>
        ))}
      </div>


      <div className="premium-panel edge-sheen mx-auto w-full max-w-[920px] p-4">
        <button
          type="button"
          onClick={() => setShowRules((v) => !v)}
          className="flex w-full items-center gap-2 text-left"
        >
          <Info className="size-4 shrink-0 text-primary" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-foreground">
            Stages are only sent when they still apply
          </span>
          <ChevronDown
            className={`ml-auto size-4 shrink-0 text-muted-foreground transition-transform ${showRules ? "rotate-180" : ""}`}
            strokeWidth={2}
          />
        </button>
        {showRules && (
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {[
              "Guest already checked in → the reminder is skipped",
              "Pre-check-in complete → no follow-up is sent",
              "Guest already booked direct → winback stops",
              "Negative feedback → incentives are never sent",
              "Offer already redeemed → it is not offered again",
              "Too many recent messages → sending is delayed",
            ].map((r) => (
              <li
                key={r}
                className="flex items-start gap-2 rounded-xl border border-border/60 bg-gradient-to-b from-secondary/55 to-secondary/20 px-3 py-2 text-[12.5px] text-muted-foreground"
              >
                <Check className="mt-0.5 size-3.5 shrink-0 text-success" strokeWidth={2.6} />
                {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      {previewStage && (
        <StagePreview
          key={previewStage.id}
          stage={previewStage}
          open
          onOpenChange={(v) => !v && setPreviewId(null)}
        />
      )}
    </div>
  );
}
