import { useEffect, useMemo, useState } from "react";
import { Check, Gift, Minus, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import type { Stage, StageOffer } from "./journey";
import { stageAudience } from "./stage-config";
import { OfferShowcase } from "./OfferShowcase";
import { Modal, ModalSection } from "./Modal";
import { Btn } from "./ui";
import { useOta } from "./state";
import type { GuestSegmentId } from "./segments";
import { guestSegments, segmentName, segmentShort, stageSegmentPlays } from "./segments";

const isPercent = (type: string) => type === "Discount";
const isFixed = (type: string) => type === "Fixed discount";

type SegmentKey = GuestSegmentId | "all";

export function OfferDialog({
  stage,
  open,
  onOpenChange,
  presetOfferId,
  presetSegment,
}: {
  stage: Stage;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  presetOfferId?: string;
  presetSegment?: SegmentKey;
}) {
  const { saveOffer, removeOffer } = useOta();
  const [segment, setSegment] = useState<SegmentKey>(presetSegment ?? "all");
  const existing = stage.offers.find((o) => o.segment === segment);

  const [selected, setSelected] = useState<string>(
    presetOfferId ?? existing?.id ?? stage.incentiveOptions[0]!.id,
  );
  const [cap, setCap] = useState(existing?.cap ?? "");
  const [amount, setAmount] = useState(10);

  useEffect(() => {
    if (!open) return;
    setSegment(presetSegment ?? "all");
  }, [open, presetSegment]);

  useEffect(() => {
    if (!open) return;
    const cur = stage.offers.find((o) => o.segment === segment);
    setSelected(presetOfferId ?? cur?.id ?? stage.incentiveOptions[0]!.id);
    setCap(cur?.cap ?? "");
    const parsed = Number(cur?.name.replace(/[^\d]/g, ""));
    setAmount(Number.isFinite(parsed) && parsed > 0 ? parsed : 10);
  }, [open, segment, presetOfferId, stage]);

  const option =
    stage.incentiveOptions.find((o) => o.id === selected) ?? stage.incentiveOptions[0]!;
  const plays = stageSegmentPlays[stage.id] ?? [];
  const play = plays.find((p) => p.segmentId === segment);
  const audience = stageAudience[stage.id];

  const name = useMemo(() => {
    if (isPercent(option.type)) return `${amount}% off direct`;
    if (isFixed(option.type)) return `$${amount} off direct`;
    return option.name;
  }, [option, amount]);

  const reach = play?.guests ?? stage.guests;
  const resultFor = (id: string) => stage.offerResults.find((r) => r.id === id);
  const recommended = play?.offerId === option.id;

  const save = () => {
    const offer: StageOffer = {
      id: option.id,
      name,
      type: option.type,
      cost: option.cost,
      segment,
      audienceMode: "all",
      conditions: [],
      ...(cap ? { cap } : {}),
    };
    saveOffer(stage.id, offer);
    toast.success(`${name} attached · ${segmentName(segment)}`, {
      description: `${reach.toLocaleString()} guests in this segment will receive it.`,
    });
    onOpenChange(false);
  };

  const remove = () => {
    removeOffer(stage.id, segment);
    toast.success(`Offer removed for ${segmentName(segment)}`);
    onOpenChange(false);
  };

  const segmentTabs: SegmentKey[] = [
    "all",
    ...plays.map((p) => p.segmentId),
    ...guestSegments.map((s) => s.id).filter((id) => !plays.some((p) => p.segmentId === id)),
  ];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      icon={Gift}
      eyebrow="Step 3 · Offer"
      title={existing ? `Edit the offer on ${stage.name}` : `Attach an offer to ${stage.name}`}
      description="Pick the guest segment, choose the incentive, and see exactly how the guest receives it."
      size="xl"
      footer={
        <div className="flex flex-wrap items-center gap-2">
          <Btn onClick={save}>{existing ? "Save offer" : "Attach offer"}</Btn>
          <Btn variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Btn>
          {existing && (
            <Btn variant="danger" onClick={remove}>
              Remove offer
            </Btn>
          )}
          <p className="ml-auto inline-flex items-center gap-1.5 text-[11.5px] font-medium text-muted-foreground">
            <Users className="size-3.5" strokeWidth={2} />
            {reach.toLocaleString()} guests in {segmentName(segment).toLowerCase()}
          </p>
        </div>
      }
    >
      <div className="grid gap-4 bg-secondary/25 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-4">
          <ModalSection label="Guest segment" hint="One offer per segment — nobody sees two.">
            <div className="flex flex-wrap gap-2">
              {segmentTabs.map((id) => {
                const on = id === segment;
                const attached = stage.offers.some((o) => o.segment === id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSegment(id)}
                    className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all ${
                      on
                        ? "border-primary bg-primary text-primary-foreground shadow-card"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {segmentShort(id)}
                    {attached && !on && <span className="ml-1.5 text-primary">•</span>}
                  </button>
                );
              })}
            </div>
            {play && (
              <p className="mt-3 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-soft/45 px-3.5 py-3 text-[12.5px] leading-relaxed text-muted-foreground">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" strokeWidth={2} />
                <span>
                  <span className="font-semibold text-foreground">{play.offerName}</span> works best
                  here — {play.predicted.toLowerCase()}. {play.reason}
                  {play.offerId !== selected && (
                    <button
                      type="button"
                      onClick={() => setSelected(play.offerId)}
                      className="ml-1.5 font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      Use it
                    </button>
                  )}
                </span>
              </p>
            )}
          </ModalSection>

          <ModalSection
            label="Choose the offer"
            hint="Past performance of each incentive in this stage."
          >
            <div className="grid gap-2">
              {stage.incentiveOptions.map((o) => {
                const on = o.id === selected;
                const r = resultFor(o.id);
                const best = play?.offerId === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setSelected(o.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                      on
                        ? "border-primary bg-primary-soft/40 shadow-card"
                        : "border-border bg-card hover:border-primary/35"
                    }`}
                  >
                    <span
                      className={`grid size-4.5 shrink-0 place-items-center rounded-full border ${on ? "border-primary bg-primary" : "border-border-strong"}`}
                    >
                      {on && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[13.5px] font-semibold text-foreground">
                          {on ? name : o.name}
                        </span>
                        {best && (
                          <span className="rounded-full border border-gold/40 bg-gold-soft px-2 py-0.5 text-[10.5px] font-semibold text-[oklch(0.5_0.11_82)]">
                            Recommended
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-muted-foreground">
                        {o.type} · {o.cost}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      {r ? (
                        <>
                          <span className="block text-[13px] font-semibold text-foreground tabular-nums">
                            {r.rate}
                          </span>
                          <span className="block text-[11.5px] text-muted-foreground">
                            {r.revenue} direct
                          </span>
                        </>
                      ) : (
                        <span className="block text-[11.5px] text-muted-foreground">
                          {best && play ? play.predicted : "Not tested yet"}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
              {(isPercent(option.type) || isFixed(option.type)) && (
                <label className="block">
                  <span className="text-[11.5px] font-medium text-muted-foreground">
                    {isPercent(option.type) ? "Discount percentage" : "Discount amount (USD)"}
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-input bg-card px-3.5 text-[13.5px] text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                  />
                </label>
              )}
              <label className="block">
                <span className="text-[11.5px] font-medium text-muted-foreground">
                  Limit (optional)
                </span>
                <input
                  value={cap}
                  onChange={(e) => setCap(e.target.value)}
                  placeholder="e.g. Max 40 upgrades per week"
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-card px-3.5 text-[13.5px] text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </label>
            </div>
          </ModalSection>

          {audience && (
            <ModalSection
              label="Who receives it"
              hint="Rows with a tick receive this offer. Muted rows are excluded automatically."
            >
              <div className="overflow-hidden rounded-xl border border-border">
                {audience.applies.map((a) => (
                  <div
                    key={a.label}
                    className="flex items-center gap-2.5 border-b border-border px-3.5 py-2.5 text-[12.5px] text-foreground last:border-b-0"
                  >
                    <Check className="size-3.5 shrink-0 text-success" strokeWidth={2.4} />
                    {a.label}
                    <span className="ml-auto font-semibold tabular-nums">
                      {a.guests.toLocaleString()}
                    </span>
                  </div>
                ))}
                {audience.excluded.map((a) => (
                  <div
                    key={a.label}
                    className="flex items-center gap-2.5 border-b border-border bg-secondary/40 px-3.5 py-2.5 text-[12.5px] text-muted-foreground last:border-b-0"
                  >
                    <Minus className="size-3.5 shrink-0" strokeWidth={2.4} />
                    {a.label}
                    <span className="ml-auto font-semibold tabular-nums text-foreground">
                      {a.guests.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </ModalSection>
          )}
        </div>

        <div className="space-y-3 lg:sticky lg:top-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              How the guest sees it
            </p>
            <div className="mt-3">
              <OfferShowcase
                name={name}
                type={option.type}
                segment={segment}
                note={option.note}
                terms={cap ? cap : `${option.cost} to the hotel`}
                {...(recommended ? { badge: "Recommended" } : {})}
                {...(play
                  ? {
                      insight: `Guests who receive this offer in this stage ${play.predicted.toLowerCase()}.`,
                    }
                  : {})}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
