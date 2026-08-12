import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import type { StageOpportunity } from "./opportunity";

import { segmentShort, segmentTint, stageSegmentPlays } from "./segments";
import { useScale } from "./scale";
import { OfferGiftCard } from "./OfferGiftCard";
import { Btn, InfoTip } from "./ui";

/** The offer Directful would attach for this opportunity. */
function bestPlay(o: StageOpportunity) {
  const plays = stageSegmentPlays[o.stageId] ?? [];
  return (
    plays.find((p) => p.segmentId === o.segmentId) ?? plays.find((p) => p.offerId === o.offerId)
  );
}

/**
 * The single recommendation surface. Same component everywhere so an
 * opportunity always looks — and reads — the same way.
 */
export function OpportunityCard({
  opportunity,
  onAccept,
  onReview,
  compact,
  footer,
}: {
  opportunity: StageOpportunity;
  onAccept?: () => void;
  onReview?: () => void;
  compact?: boolean;
  footer?: ReactNode;
}) {
  const scale = useScale();
  const play = bestPlay(opportunity);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10.5px] font-semibold tracking-[0.14em] text-primary uppercase">
              Guest opportunity
            </p>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${segmentTint(
                opportunity.segmentId,
              )}`}
            >
              {segmentShort(opportunity.segmentId)}
            </span>
            <InfoTip>{opportunity.method}</InfoTip>
          </div>

          <p className="mt-1.5 text-[16px] leading-snug font-semibold tracking-[-0.01em] text-foreground">
            {scale.value(opportunity.headline)}
          </p>

          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            {opportunity.recommendation}
          </p>

          {!compact && (
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5 border-t border-border pt-3 text-[12px] text-muted-foreground">
              <span>
                Revenue opportunity{" "}
                <span className="font-semibold text-foreground">
                  {scale.value(opportunity.revenueOpportunity)}
                </span>
              </span>
              <span>
                Guests{" "}
                <span className="font-semibold text-foreground">
                  {scale.count(opportunity.guests)}
                </span>
              </span>
              {play && (
                <span>
                  Predicted <span className="font-semibold text-foreground">{play.predicted}</span>
                </span>
              )}
            </div>
          )}

          {(onAccept || onReview || footer) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {onAccept && (
                <Btn
                  size="sm"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onAccept();
                  }}
                >
                  Attach this offer
                </Btn>
              )}
              {onReview && (
                <Btn
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onReview();
                  }}
                >
                  Review audience
                </Btn>
              )}
              {footer}
            </div>
          )}
        </div>

        {play && (
          <div>
            <p className="mb-2 text-[10.5px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Best offer for this group
            </p>
            <OfferGiftCard
              compact
              name={play.offerName}
              type="Recommended"
              segment={opportunity.segmentId}
              terms={play.predicted}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * One-line, in-context opportunity. Used on journey stage cards and in the
 * stage overview — an actionable insight, never a dashboard card.
 */
export function OpportunityLine({
  opportunity,
  onView,
}: {
  opportunity: StageOpportunity;
  onView?: () => void;
}) {
  const scale = useScale();
  const play = bestPlay(opportunity);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-primary/20 bg-primary-soft/40 px-4 py-3">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-primary uppercase shadow-card">
        <Sparkles className="size-3" strokeWidth={2.4} /> Opportunity
      </span>
      <p className="min-w-0 flex-1 text-[12.5px] leading-relaxed text-foreground">
        {scale.value(opportunity.headline)} ·{" "}
        <span className="font-semibold">
          {scale.value(opportunity.revenueOpportunity)} potential
        </span>
        {play && <span className="text-muted-foreground"> · best offer {play.offerName}</span>}
      </p>
      {onView && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="shrink-0 text-[12.5px] font-semibold text-primary hover:underline"
        >
          View opportunity →
        </button>
      )}
    </div>
  );
}
