import { TrendingUp } from "lucide-react";
import { GuestOfferCard } from "./GuestOffer";
import { resolveOffer } from "./offers";
import type { GuestSegmentId } from "./segments";

/**
 * The offer exactly as a guest sees it, wrapped with the hotel-side insight
 * line. The guest card itself never carries analytical language.
 */

/** Plain-language benefits derived from the offer, so it always reads like an offer. */
export function offerBenefits(name: string, type: string): string[] {
  return resolveOffer({ name, type }).benefits;
}

export function OfferShowcase({
  name,
  segment,
  note,
  terms,
  cta = "Claim this offer",
  insight,
  compact,
  offerId,
  stageId = "just-booked",
}: {
  name: string;
  type?: string;
  segment?: GuestSegmentId | "all";
  note?: string;
  terms?: string;
  benefits?: string[];
  badge?: string;
  cta?: string;
  insight?: string;
  compact?: boolean;
  offerId?: string;
  stageId?: string;
}) {
  return (
    <div>
      <GuestOfferCard
        {...(offerId ? { offerId } : {})}
        name={name}
        stageId={stageId}
        {...(segment ? { segment } : {})}
        {...(note ? { note } : {})}
        {...(terms ? { terms } : {})}
        cta={cta}
        {...(compact ? { compact } : {})}
      />
      {insight && (
        <div className="mt-2 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary-soft/50 px-3.5 py-2.5">
          <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-primary" strokeWidth={2.2} />
          <p className="text-[11.5px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Hotel view only</span> — {insight}
          </p>
        </div>
      )}
    </div>
  );
}
