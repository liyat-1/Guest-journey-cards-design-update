/**
 * How an offer looks to the guest.
 *
 * Each kind of benefit gets its own visual language: a room upgrade never
 * looks like a discount, and a spa credit never looks like breakfast. One
 * component, seven archetypes — used in the editor preview, the landing page,
 * the email and the journey.
 */
import { ArrowRight, Check, MapPin, Plane } from "lucide-react";
import { resolveOffer, toneClasses, voiceFor, type OfferDef } from "./offers";
import { segmentShort } from "./segments";
import type { GuestSegmentId } from "./segments";

function Art({ offer }: { offer: OfferDef }) {
  const tone = toneClasses[offer.tone];
  const Icon = offer.icon;

  if (offer.art === "room")
    return (
      <div className={`flex items-center gap-3 rounded-xl ${tone.soft} px-3.5 py-3`}>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Your room
          </p>
          <p className="truncate text-[12.5px] font-medium text-muted-foreground">Deluxe King</p>
        </div>
        <ArrowRight className={`size-4 shrink-0 ${tone.text}`} strokeWidth={2.2} />
        <div className="min-w-0 flex-1 text-right">
          <p className={`text-[10px] font-semibold tracking-[0.12em] uppercase ${tone.text}`}>
            Your upgrade
          </p>
          <p className="truncate text-[12.5px] font-semibold text-foreground">
            {offer.id === "suite" ? "Bosphorus Suite" : "Premium City View"}
          </p>
        </div>
      </div>
    );

  if (offer.art === "menu")
    return (
      <div className={`rounded-xl ${tone.soft} px-3.5 py-3`}>
        {[
          offer.id === "breakfast" ? "Breakfast buffet" : "Starter & main",
          offer.id === "breakfast" ? "Fresh pastries & coffee" : "Glass of wine",
          offer.id === "breakfast" ? "Served 07:00 – 10:30" : "Dessert",
        ].map((row, i) => (
          <div key={row} className={`flex items-baseline gap-2 ${i ? "mt-1.5" : ""}`}>
            <span className="text-[12px] text-foreground">{row}</span>
            <span className="min-w-4 flex-1 border-b border-dotted border-border-strong" />
            <span className={`text-[11.5px] font-semibold ${tone.text}`}>
              {i === 0 ? offer.value : "Included"}
            </span>
          </div>
        ))}
      </div>
    );

  if (offer.art === "wellness")
    return (
      <div className={`flex items-center gap-3.5 rounded-xl ${tone.soft} px-3.5 py-3`}>
        <span className={`grid size-10 shrink-0 place-items-center rounded-full bg-card ${tone.text}`}>
          <Icon className="size-[18px]" strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-foreground">{offer.value}</p>
          <div className="mt-1.5 flex gap-1">
            {[0, 1, 2, 3].map((n) => (
              <span
                key={n}
                className={`h-1 w-6 rounded-full ${n < 3 ? tone.solid.split(" ")[0] : "bg-border-strong"}`}
              />
            ))}
          </div>
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">
            {offer.id === "gym" ? "Open 06:00 – 22:00" : "Book any treatment at reception"}
          </p>
        </div>
      </div>
    );

  if (offer.art === "value")
    return (
      <div className={`rounded-xl ${tone.soft} px-3.5 py-3`}>
        <p className={`text-[26px] leading-none font-semibold tracking-[-0.03em] ${tone.text}`}>
          {offer.value}
        </p>
        <div className="mt-2.5 flex items-center gap-2 text-[11.5px]">
          <span className="text-muted-foreground line-through">Booking site rate</span>
          <ArrowRight className="size-3 text-muted-foreground" strokeWidth={2.2} />
          <span className="font-semibold text-foreground">Direct rate</span>
        </div>
      </div>
    );

  if (offer.art === "clock")
    return (
      <div className={`rounded-xl ${tone.soft} px-3.5 py-3`}>
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
          <span>{offer.id === "early" ? "11:00" : "12:00"}</span>
          <span className={tone.text}>{offer.id === "early" ? "Your arrival" : "Your departure"}</span>
          <span>{offer.id === "early" ? "15:00" : "14:00"}</span>
        </div>
        <div className="relative mt-2 h-1.5 rounded-full bg-card">
          <span
            className={`absolute inset-y-0 rounded-full ${tone.solid.split(" ")[0]} ${
              offer.id === "early" ? "left-0 w-[42%]" : "right-0 w-[42%]"
            }`}
          />
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground">
          {offer.id === "early"
            ? "Four extra hours in your room, at no charge."
            : "Two extra hours before you head home."}
        </p>
      </div>
    );

  if (offer.art === "route")
    return (
      <div className={`flex items-center gap-2.5 rounded-xl ${tone.soft} px-3.5 py-3`}>
        <span className={`grid size-8 shrink-0 place-items-center rounded-full bg-card ${tone.text}`}>
          {offer.id === "parking" ? (
            <Icon className="size-4" strokeWidth={2} />
          ) : (
            <Plane className="size-4" strokeWidth={2} />
          )}
        </span>
        <span className="h-px min-w-4 flex-1 border-t border-dashed border-border-strong" />
        <span className={`shrink-0 text-[11.5px] font-semibold ${tone.text}`}>{offer.value}</span>
        <span className="h-px min-w-4 flex-1 border-t border-dashed border-border-strong" />
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card text-foreground">
          <MapPin className="size-4" strokeWidth={2} />
        </span>
      </div>
    );

  return (
    <div className={`flex items-center gap-3.5 rounded-xl ${tone.soft} px-3.5 py-3`}>
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl bg-card ${tone.text}`}>
        <Icon className="size-[18px]" strokeWidth={1.9} />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-foreground">{offer.value}</p>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">
          Waiting for you when you arrive.
        </p>
      </div>
    </div>
  );
}

/**
 * The full guest-facing offer card. Only hospitality language appears here —
 * performance data lives on the hotelier side.
 */
export function GuestOfferCard({
  offerId,
  name,
  stageId = "just-booked",
  segment,
  note,
  terms,
  cta,
  compact,
  showFraming = true,
}: {
  offerId?: string;
  name?: string;
  stageId?: string;
  segment?: GuestSegmentId | "all";
  note?: string;
  terms?: string;
  cta?: string;
  compact?: boolean;
  showFraming?: boolean;
}) {
  const offer = resolveOffer({ ...(offerId ? { id: offerId } : {}), ...(name ? { name } : {}) });
  const tone = toneClasses[offer.tone];
  const voice = voiceFor(stageId);
  const Icon = offer.icon;
  const title = name ?? offer.name;

  return (
    <div className={`overflow-hidden rounded-2xl border bg-card ${tone.border} shadow-raise`}>
      {showFraming && (
        <div className={`border-b ${tone.border} bg-gradient-to-b ${tone.art} px-4 py-3`}>
          <p className={`text-[10px] font-semibold tracking-[0.16em] uppercase ${tone.text}`}>
            {voice.eyebrow}
          </p>
          <p className="mt-1 font-serif text-[16px] leading-snug text-foreground">
            {voice.headline}
          </p>
        </div>
      )}

      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone.soft} ${tone.text}`}>
            <Icon className="size-4" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {offer.type}
            </p>
            <p className="mt-0.5 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-foreground">
              {title}
            </p>
          </div>
          {segment && segment !== "all" && (
            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10.5px] font-semibold text-muted-foreground">
              {segmentShort(segment)}
            </span>
          )}
        </div>

        <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
          {note ?? offer.guest}
        </p>

        <div className="mt-3">
          <Art offer={offer} />
        </div>

        {!compact && (
          <ul className="mt-3 space-y-1.5">
            {offer.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[12px] text-foreground">
                <Check className={`mt-0.5 size-3.5 shrink-0 ${tone.text}`} strokeWidth={2.4} />
                <span className="leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        )}

        <span
          className={`mt-3.5 flex h-10 w-full items-center justify-center rounded-xl text-[13px] font-semibold ${tone.solid}`}
        >
          {cta ?? voice.cta}
        </span>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">{terms ?? voice.closing}</p>
      </div>
    </div>
  );
}

/**
 * A single-line offer chip for dense hotelier surfaces — journey cards, tables
 * and message previews. Still typed by the kind of benefit.
 */
export function OfferInline({
  offerId,
  name,
  segment,
}: {
  offerId?: string;
  name?: string;
  segment?: GuestSegmentId | "all";
}) {
  const offer = resolveOffer({ ...(offerId ? { id: offerId } : {}), ...(name ? { name } : {}) });
  const tone = toneClasses[offer.tone];
  const Icon = offer.icon;
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2 py-1 text-[11.5px] font-medium ${tone.border} ${tone.soft} text-foreground`}
    >
      <Icon className={`size-3 shrink-0 ${tone.text}`} strokeWidth={2.2} />
      <span className="truncate">{name ?? offer.name}</span>
      {segment && segment !== "all" && (
        <span className="shrink-0 text-muted-foreground">· {segmentShort(segment)}</span>
      )}
    </span>
  );
}

/** The offer as it appears inside an email body. */
export function OfferEmailBlock({
  offerId,
  name,
  stageId,
  terms,
}: {
  offerId?: string;
  name?: string;
  stageId: string;
  terms?: string;
}) {
  const offer = resolveOffer({ ...(offerId ? { id: offerId } : {}), ...(name ? { name } : {}) });
  const tone = toneClasses[offer.tone];
  const voice = voiceFor(stageId);
  const Icon = offer.icon;
  return (
    <div className={`overflow-hidden rounded-2xl border ${tone.border}`}>
      <div className={`bg-gradient-to-b ${tone.art} px-4 pt-3.5 pb-4`}>
        <p className={`text-[9.5px] font-semibold tracking-[0.16em] uppercase ${tone.text}`}>
          {voice.eyebrow}
        </p>
        <p className="mt-1 font-serif text-[16px] leading-snug text-foreground">{voice.headline}</p>

        <div className="mt-3 flex items-start gap-3 rounded-xl border border-border bg-card px-3.5 py-3">
          <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${tone.soft} ${tone.text}`}>
            <Icon className="size-4" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold text-foreground">{name ?? offer.name}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{offer.guest}</p>
            <p className={`mt-1.5 text-[11.5px] font-semibold ${tone.text}`}>{offer.value}</p>
          </div>
        </div>

        <span
          className={`mt-3 flex h-10 w-full items-center justify-center rounded-xl text-[12.5px] font-semibold ${tone.solid}`}
        >
          {voice.cta}
        </span>
        <p className="mt-2 text-center text-[10.5px] text-muted-foreground">
          {terms ?? voice.closing}
        </p>
      </div>
    </div>
  );
}