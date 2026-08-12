import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, Eye, Info, Tag } from "lucide-react";
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
function TimingPill({ stageId }: { stageId: string }) {
  const { configs, setTiming } = useOta();
  const timing = configs[stageId]?.timing;
  if (!timing) return null;

  return (
    <div className="relative flex justify-center py-2">
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-border via-border-strong to-border" />
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="relative inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-[11.5px] font-semibold text-muted-foreground shadow-card transition-colors hover:border-primary/40 hover:text-primary"
          >
            {timingLabel(timing)}
            <ChevronDown className="size-3" strokeWidth={2.2} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-[290px] rounded-2xl p-4">
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
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card-hover"
    >
      <span className={`absolute inset-x-0 top-0 h-[3px] ${look.rail}`} aria-hidden />

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5 sm:flex sm:items-start sm:gap-4">
          <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${look.tile}`}>
            <Icon className="size-[19px]" strokeWidth={2} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[16.5px] font-semibold tracking-[-0.015em] text-foreground">
                {stage.name}
              </h3>
              <span className="text-[11.5px] text-muted-foreground">· {look.intent}</span>
            </div>
            <p className="mt-1.5 line-clamp-1 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
              {line}
            </p>
          </div>

          <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-auto sm:shrink-0 sm:justify-end">
            <Chip>{isText ? "Text message" : "Email"}</Chip>
            {stage.offers.length > 0 ? (
              stage.offers.map((o) => (
                <Chip key={`${o.segment}-${o.id}`} tone="gold">
                  <Tag className="size-3" strokeWidth={2.2} /> {o.name} · {segmentShort(o.segment)}
                </Chip>
              ))
            ) : (
              <Chip>No offer</Chip>
            )}
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <DataPoint key={m.label} label={m.label} value={scale.value(m.value)} />
          ))}
          {perf && (
            <div className="rounded-xl border border-primary/20 bg-primary-soft/40 px-3.5 py-3">
              <p className="truncate text-[10.5px] font-semibold tracking-[0.1em] text-primary uppercase">
                Stage performance
              </p>
              <p className="mt-1.5 text-[18px] leading-none font-semibold tracking-[-0.025em] text-foreground tabular-nums">
                {scale.value(perf.rate)}
              </p>
              <p className="mt-1.5">
                <DeltaTag delta={perf.delta} suffix="vs previous" />
              </p>
            </div>
          )}
        </dl>

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

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
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

      <div>
        {stages.map((s) => (
          <div key={s.id}>
            <TimingPill stageId={s.id} />
            <StageCard stage={s} onPreview={() => setPreviewId(s.id)} />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
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
                className="flex items-start gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-[12.5px] text-muted-foreground"
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
