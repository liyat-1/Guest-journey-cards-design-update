import { Gift } from "lucide-react";
import { segmentShort } from "./segments";
import type { GuestSegmentId } from "./segments";

/**
 * The offer, rendered as a gift card. One visual language for every offer in
 * the product — the journey, the stage, the editor preview and opportunities.
 */
export function OfferGiftCard({
  name,
  type,
  segment,
  terms,
  note,
  compact,
}: {
  name: string;
  type: string;
  segment?: GuestSegmentId | "all";
  terms?: string;
  note?: string;
  compact?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-gold-soft/60">
      <span
        className="pointer-events-none absolute inset-y-0 left-[38%] w-px border-l border-dashed border-gold/45 sm:left-[42%]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -top-2.5 left-[38%] size-5 -translate-x-1/2 rounded-full bg-card sm:left-[42%]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-2.5 left-[38%] size-5 -translate-x-1/2 rounded-full bg-card sm:left-[42%]"
        aria-hidden
      />

      <div className="relative flex items-stretch">
        <div className="flex w-[38%] flex-col justify-center gap-1.5 px-4 py-4 sm:w-[42%] sm:px-5">
          <span className="inline-flex size-7 items-center justify-center rounded-lg bg-card/80 text-[oklch(0.5_0.11_82)]">
            <Gift className="size-3.5" strokeWidth={2} />
          </span>
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[oklch(0.5_0.11_82)] uppercase">
            {type}
          </p>
          {segment && (
            <p className="text-[11.5px] font-medium text-muted-foreground">
              {segmentShort(segment)}
            </p>
          )}
        </div>

        <div className="min-w-0 flex-1 px-4 py-4 sm:px-5">
          <p
            className={`font-serif leading-snug text-foreground ${compact ? "text-[17px]" : "text-[21px]"}`}
          >
            {name}
          </p>
          {note && !compact && (
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{note}</p>
          )}
          {terms && <p className="mt-2 text-[11.5px] text-muted-foreground">{terms}</p>}
        </div>
      </div>
    </div>
  );
}
