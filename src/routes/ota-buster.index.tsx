import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Check,
  ChevronDown,
  Clock,
  Eye,
  Gift,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  MousePointerClick,
  Pause,
  Pencil,
  Phone,
  PhoneCall,
  Play,
  Reply,
} from "lucide-react";

import { useState, type ReactNode } from "react";
import type { Stage } from "@/components/ota/journey";
import { stageJourneyStats, type Delta } from "@/components/ota/analytics";
import { persona } from "@/components/ota/personality";
import { timingAnchors, timingLabel, type TimingUnit } from "@/components/ota/stage-config";
import { useOta } from "@/components/ota/state";
import { useScale } from "@/components/ota/scale";
import { StagePreview } from "@/components/ota/StagePreview";
import { Modal, ModalSection } from "@/components/ota/Modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bar, Btn, DataPoint, DeltaTag, SectionHeading } from "@/components/ota/ui";

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
  const { configs } = useOta();
  const scale = useScale();
  const [paused, setPaused] = useState(false);
  const isText = stage.message.channel === "Text";
  const look = persona(stage.id);
  const Icon = look.icon;
  const metrics = stageCardMetrics[stage.id] ?? [];
  const perf = stageJourneyPerformance[stage.id];
  const timing = configs[stage.id]?.timing;
  const open = () => navigate({ to: "/ota-buster/stage/$stageId", params: { stageId: stage.id } });

  // "14.5% engagement" → a confident number with a quiet label beneath it.
  const rateParts = perf ? scale.value(perf.rate).split(" ") : [];
  const rateValue = rateParts[0] ?? "";
  const rateLabel = rateParts.slice(1).join(" ") || "conversion rate";

  const audienceMetric = metrics.find((metric) => metric.label === "Guests reached") ?? metrics[0];
  const engagementMetrics = perf
    ? [
        { label: rateLabel, value: rateValue, Icon: Activity, delta: perf.delta },
        { label: "Clicks", value: perf.clicks, Icon: MousePointerClick },
        { label: "Responses", value: perf.responses, Icon: Reply },
        { label: "Calls made", value: perf.calls, Icon: PhoneCall },
      ]
    : [];

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

      <div className="relative grid lg:grid-cols-[minmax(0,0.95fr)_minmax(380px,1.05fr)]">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span
              className={`grid size-11 shrink-0 place-items-center rounded-xl ${look.tile} shadow-card`}
            >
              <Icon className="size-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-[18px] font-semibold text-foreground">{stage.name}</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/65 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  {isText ? <MessageSquare className="size-3" /> : <Mail className="size-3" />}
                  {stage.message.channel}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border-strong px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  <Gift className="size-3" />
                  {stage.offers[0]?.name ?? "No offer attached"}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${paused ? "text-muted-foreground" : "text-success"}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${paused ? "bg-border-strong" : "bg-success"}`}
                  />
                  {paused ? "Paused" : "Live"}
                </span>
              </div>
              <p className="mt-1.5 text-[12px] font-medium text-muted-foreground">
                {timing ? timingLabel(timing) : stage.message.timing}
              </p>
            </div>
          </div>

          {audienceMetric && (
            <div className="mt-5 flex items-end gap-2 border-y border-border/70 py-4">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {audienceMetric.label}
                </p>
                <p className="mt-1 text-[30px] leading-none font-semibold text-foreground tabular-nums">
                  {scale.value(audienceMetric.value)}
                </p>
              </div>
              {audienceMetric.delta && <DeltaTag delta={audienceMetric.delta} suffix="vs prev" />}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Btn
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                onPreview();
              }}
            >
              <Eye className="size-3.5" /> Preview
            </Btn>
            <Btn
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                setPaused((value) => !value);
              }}
            >
              {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              {paused ? "Resume" : "Pause"}
            </Btn>
            <Btn
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                open();
              }}
            >
              <Pencil className="size-3.5" /> Edit campaign
            </Btn>
          </div>
        </div>

        <div className="border-t border-border/70 bg-secondary/25 p-5 sm:p-6 lg:border-t-0 lg:border-l">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[10.5px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Engagement
            </p>
            {perf && <DeltaTag delta={perf.delta} suffix="vs prev" />}
          </div>
          <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
            {engagementMetrics.map(({ label, value, Icon: MetricIcon, delta }, index) => (
              <div
                key={label}
                className={`min-w-0 ${index % 2 === 1 ? "border-l border-border/70 pl-5" : ""}`}
              >
                <dt className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <MetricIcon className={`size-3.5 ${look.ink}`} strokeWidth={2} /> {label}
                </dt>
                <dd className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-[25px] leading-none font-semibold text-foreground tabular-nums">
                    {scale.value(value)}
                  </span>
                  {delta && (
                    <span className="text-[10.5px] font-semibold text-success">{delta.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/70 bg-card px-5 py-3 lg:col-span-2 sm:px-6">
          <p className="text-[11.5px] text-muted-foreground">
            Updated {stage.editors[0]?.when ?? "recently"}
          </p>
          <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View details <ArrowRight className="size-3.5" />
          </span>
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
