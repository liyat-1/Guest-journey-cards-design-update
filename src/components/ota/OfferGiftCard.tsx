import { Gift } from "lucide-react";
import { segmentShort } from "./segments";
import type { GuestSegmentId } from "./segments";

/**
 * The offer, rendered as a premium foil gift card. One visual language for
 * every offer in the product — journey, stage, editor preview, opportunities.
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
    <div className="foil relative overflow-hidden rounded-2xl border border-gold/45 shadow-raise">
      <span
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(18rem 8rem at 88% -20%, color-mix(in oklab, white 70%, transparent), transparent)",
        }}
      />
      <span
        className="pointer-events-none absolute inset-y-0 left-[38%] w-px border-l border-dashed border-gold/55 sm:left-[42%]"
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
        <div className="flex w-[38%] flex-col justify-center gap-2 px-4 py-4 sm:w-[42%] sm:px-5">
          <span className="inline-flex size-8 items-center justify-center rounded-xl bg-card/85 text-[oklch(0.5_0.11_82)] shadow-card ring-1 ring-gold/30">
            <Gift className="size-4" strokeWidth={2} />
          </span>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-[oklch(0.46_0.1_82)] uppercase">
            {type}
          </p>
          {segment && (
            <p className="text-[11.5px] font-medium text-foreground/60">{segmentShort(segment)}</p>
          )}
        </div>

        <div className="min-w-0 flex-1 px-4 py-4 sm:px-5">
          <p
            className={`font-serif leading-snug tracking-[-0.01em] text-foreground ${compact ? "text-[17px]" : "text-[22px]"}`}
          >
            {name}
          </p>
          {note && !compact && (
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-foreground/65">{note}</p>
          )}
          {terms && <p className="mt-2 text-[11.5px] text-foreground/55">{terms}</p>}
        </div>
      </div>
    </div>
  );
}
