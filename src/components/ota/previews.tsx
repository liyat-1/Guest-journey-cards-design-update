import type { ReactNode } from "react";
import { Check, ShieldCheck, Star } from "lucide-react";
import type { Stage, StageMessage, StageOffer } from "./journey";
import { primaryOffer, property } from "./journey";
import propertyHero from "@/assets/property-hero.jpg";
import { OfferShowcase } from "./OfferShowcase";

const sample: Record<string, string> = {
  "{{guest.first_name}}": "Sarah",
  "{{guest.last_name}}": "Whitfield",
  "{{hotel.name}}": property,
  "{{arrival_date}}": "June 24",
  "{{departure_date}}": "June 27",
  "{{room_type}}": "Deluxe King",
  "{{stay_dates}}": "June 24–27",
  "{{offer}}": "10% off",
  "{{booking_link}}": "directful.co/stay",
};

export function fill(text: string, offerName?: string) {
  let out = text;
  for (const [token, value] of Object.entries(sample)) {
    out = out.split(token).join(token === "{{offer}}" && offerName ? offerName : value);
  }
  return out;
}

export function Device({
  mode,
  children,
  label,
  chrome = "browser",
}: {
  mode: "desktop" | "mobile";
  children: ReactNode;
  label?: string;
  /** Desktop frame style: a browser window or a mail client window. */
  chrome?: "browser" | "mail";
}) {
  if (mode === "mobile") {
    return (
      <div className="mx-auto w-full max-w-[330px]">
        <div className="rounded-[42px] bg-foreground p-[10px] shadow-card-hover">
          <div className="relative overflow-hidden rounded-[33px] bg-background">
            <div className="relative flex items-center justify-between bg-card px-6 pt-3 pb-1.5 text-[11px] font-semibold text-foreground">
              <span>9:41</span>
              <span className="absolute left-1/2 top-1.5 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-foreground" />
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="inline-block h-2 w-3.5 rounded-[2px] border border-current" />
              </span>
            </div>
            <div className="max-h-[520px] overflow-y-auto">{children}</div>
            <div className="flex justify-center bg-card py-2">
              <span className="h-1 w-28 rounded-full bg-border-strong" />
            </div>
          </div>
        </div>
        {label && <p className="mt-2 text-center text-[11.5px] text-muted-foreground">{label}</p>}
      </div>
    );
  }
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
        {chrome === "mail" ? (
          <div className="flex items-center gap-3 border-b border-border bg-secondary/60 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-border-strong" />
              <span className="size-2 rounded-full bg-border-strong" />
              <span className="size-2 rounded-full bg-border-strong" />
            </div>
            <span className="ml-2 text-[11.5px] font-medium text-muted-foreground">Inbox</span>
            <span className="ml-auto truncate text-[11.5px] text-muted-foreground">
              {property} &lt;stay@directful.co&gt;
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 border-b border-border bg-secondary/60 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-border-strong" />
              <span className="size-2 rounded-full bg-border-strong" />
              <span className="size-2 rounded-full bg-border-strong" />
            </div>
            <span className="ml-2 flex-1 truncate rounded-md bg-card px-2.5 py-1 text-[11px] text-muted-foreground">
              directful.co/stay
            </span>
          </div>
        )}
        <div className="max-h-[560px] overflow-y-auto bg-background">{children}</div>
      </div>
      {label && <p className="mt-2 text-[11.5px] text-muted-foreground">{label}</p>}
    </div>
  );
}

export function EmailRender({ stage, message }: { stage: Stage; message: StageMessage }) {
  const offer = primaryOffer(stage);
  const offerName = offer?.name;
  return (
    <div className="bg-secondary/40 p-4 sm:p-6">
      <div className="mx-auto max-w-[560px] overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border bg-primary-soft/60 px-6 py-5 text-center">
          <p className="font-serif text-[17px] tracking-[-0.01em] text-foreground">{property}</p>
          <p className="mt-0.5 text-[10.5px] font-semibold tracking-[0.18em] text-primary uppercase">
            Istanbul · Türkiye
          </p>
        </div>
        <div className="px-6 py-6">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            {stage.name}
          </p>
          <h4 className="mt-2 font-serif text-[22px] leading-tight text-foreground">
            {fill(message.subject || stage.purpose, offerName)}
          </h4>
          {message.body.split("\n\n").map((p, i) => (
            <p key={i} className="mt-3.5 text-[13.5px] leading-relaxed text-muted-foreground">
              {fill(p, offerName)}
            </p>
          ))}

          {offer && (
            <div className="mt-5 rounded-xl border border-gold/40 bg-gold-soft/70 px-4 py-3.5">
              <p className="text-[10.5px] font-semibold tracking-[0.12em] text-[oklch(0.5_0.11_82)] uppercase">
                Offer attached
              </p>
              <p className="mt-1 text-[14.5px] font-semibold text-foreground">{offer.name}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {offer.audienceMode === "all"
                  ? "Included for every guest in this stage"
                  : "Included for eligible guests only"}
              </p>
            </div>
          )}

          <div className="mt-6">
            <span className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-[13px] font-semibold text-primary-foreground">
              {message.cta}
            </span>
          </div>

          <p className="mt-6 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
            You're receiving this because you have a reservation at {property}. Manage your
            preferences or unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TextRender({ stage, message }: { stage: Stage; message: StageMessage }) {
  return (
    <div className="min-h-[320px] bg-secondary/40 px-4 py-5">
      <p className="text-center text-[11px] font-medium text-muted-foreground">
        {property.replace("Wyndham Grand ", "")} · SMS
      </p>
      <div className="mt-4 flex flex-col gap-3">
        <div className="max-w-[86%] rounded-2xl rounded-bl-md bg-card px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground shadow-card">
          {fill(message.body, primaryOffer(stage)?.name)}
        </div>
        <div className="ml-auto max-w-[70%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-[13px] text-primary-foreground">
          Thanks! Doing it now.
        </div>
      </div>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        {fill(message.body).length} characters · 1 segment
      </p>
    </div>
  );
}

/** One plain sentence describing when the guest can use the benefit. */
export function offerLine(stageId: string, name: string) {
  if (stageId === "post-checkout")
    return `Book direct next time and ${name.toLowerCase()} is yours.`;
  if (stageId === "winback") return `${name} applied to your next direct booking.`;
  if (stageId === "during-stay") return `${name} — added to your stay, no charge.`;
  return `${name} — confirmed the moment you complete this step.`;
}

export function LandingRender({
  stage,
  formFields,
  offers,
}: {
  stage: Stage;
  /** Data-capture fields configured for this stage; overrides the seeded copy. */
  formFields?: { label: string; required: boolean }[];
  /** Offers attached to the stage — they render inside the landing page. */
  offers?: StageOffer[];
}) {
  const l = stage.landing;
  const fields = formFields
    ? formFields.map((f) => `${f.label}${f.required ? " *" : ""}`)
    : l.fields;
  const rating = stage.id === "post-checkout";
  const shown = offers ?? stage.offers;
  return (
    <div className="bg-background">
      <div className="relative">
        <img
          src={propertyHero}
          alt={`Terrace lounge overlooking the Bosphorus at ${property}`}
          width={1024}
          height={640}
          loading="lazy"
          className="h-[210px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="absolute inset-x-0 bottom-0 px-5 pt-7 pb-8 text-background">
          <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase opacity-85">
            {property}
          </p>
          <h4 className="mt-2 font-serif text-[24px] leading-tight">{fill(l.headline)}</h4>
          <p className="mt-1.5 text-[13px] leading-relaxed opacity-90">{fill(l.sub)}</p>
        </div>
      </div>

      <div className="-mt-4 px-4">
        <div className="premium-panel edge-sheen p-4">
          <div className="grid grid-cols-2 gap-3">
            {l.facts.map((f) => (
              <div key={f.label}>
                <p className="text-[10.5px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  {f.label}
                </p>
                <p className="mt-0.5 text-[14px] font-semibold text-foreground">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 pb-6">
        <p className="text-[15px] font-semibold text-foreground">{l.sectionTitle}</p>

        {rating && (
          <>
            <div className="mt-3 flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className="size-7 fill-gold text-gold" strokeWidth={1.4} />
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-input bg-card px-3.5 py-3">
              <p className="text-[12px] font-semibold text-foreground">Tell us about your stay</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                What stood out? Anything we could do better?
              </p>
              <div className="mt-2 h-14 rounded-lg border border-dashed border-border-strong" />
            </div>
          </>
        )}

        {fields && fields.length > 0 && (
          <div className="mt-3 space-y-2.5">
            {fields.map((f) => (
              <div
                key={f}
                className="rounded-xl border border-input bg-card px-3.5 py-3 text-[13px] text-muted-foreground"
              >
                {f}
              </div>
            ))}
          </div>
        )}

        {l.cards && (
          <div className="mt-3 space-y-2.5">
            {l.cards.map((c) => (
              <div
                key={c.title}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-foreground">{c.title}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">{c.detail}</p>
                </div>
                {c.price && (
                  <span className="shrink-0 text-[12.5px] font-semibold text-primary">
                    {c.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {l.verified && (
          <div className="mt-4 rounded-xl border border-border bg-secondary/60 p-3.5">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
              <ShieldCheck className="size-4 text-primary" strokeWidth={2} /> Signed in with Google
            </p>
            <ul className="mt-2 space-y-1">
              {l.verified.map((v) => (
                <li key={v} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <Check className="size-3.5 text-success" strokeWidth={2.6} />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        )}

        {shown.length > 0 && (
          <div className="mt-5 space-y-3">
            {shown.map((o) => (
              <OfferShowcase
                key={`${o.segment}-${o.id}`}
                name={o.name}
                type={o.type}
                segment={o.segment}
                note={offerLine(stage.id, o.name)}
                {...(o.cap ? { terms: o.cap } : {})}
                cta={`Add ${o.name.toLowerCase()}`}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          className="mt-5 h-12 w-full rounded-xl bg-primary text-[14px] font-semibold text-primary-foreground"
        >
          {l.cta}
        </button>
      </div>
    </div>
  );
}

export function SuccessRender({ stage }: { stage: Stage }) {
  const s = stage.success;
  return (
    <div className="bg-background px-5 py-10 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/12">
        <Check className="size-7 text-success" strokeWidth={2.4} />
      </span>
      <h4 className="mt-4 font-serif text-[24px] leading-tight text-foreground">
        {fill(s.headline)}
      </h4>
      <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
        {fill(s.sub)}
      </p>

      <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left">
        {s.checks.map((c) => (
          <li
            key={c}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-[13px] text-foreground"
          >
            <Check className="size-4 shrink-0 text-success" strokeWidth={2.6} />
            {c}
          </li>
        ))}
      </ul>

      {s.footer && (
        <p className="mx-auto mt-5 max-w-xs text-[12.5px] text-muted-foreground">{s.footer}</p>
      )}
      {s.cta && (
        <button
          type="button"
          className="mt-5 h-11 rounded-xl border border-input bg-card px-5 text-[13px] font-semibold text-foreground"
        >
          {s.cta}
        </button>
      )}
    </div>
  );
}

export function MessageRender({ stage, message }: { stage: Stage; message: StageMessage }) {
  return message.channel === "Text" ? (
    <TextRender stage={stage} message={message} />
  ) : (
    <EmailRender stage={stage} message={message} />
  );
}

/** How an attached incentive appears to the guest on the landing page. */
export function OfferRender({
  name,
  type,
  benefits = [],
  detail,
  terms,
}: {
  name: string;
  type: string;
  benefits?: string[];
  detail?: string;
  terms?: string;
}) {
  return (
    <div className="bg-background">
      <div className="relative">
        <img
          src={propertyHero}
          alt={`Terrace lounge at ${property}`}
          width={1024}
          height={640}
          loading="lazy"
          className="h-[150px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/45" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-background uppercase">
            {property}
          </p>
          <p className="mt-1 font-serif text-[19px] leading-tight text-background">
            Welcome back, Sarah
          </p>
        </div>
      </div>
      <div className="px-5 py-5">
        <p className="text-[10.5px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {type}
        </p>
        <p className="mt-1.5 font-serif text-[22px] leading-snug text-foreground">{name}</p>
        {detail && (
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{detail}</p>
        )}
        {benefits.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-[13px] text-foreground">
                <Check className="size-3.5 shrink-0 text-success" strokeWidth={2.6} />
                {b}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-[13.5px] font-semibold text-primary-foreground">
          Book direct
        </span>
        {terms && <p className="mt-2.5 text-center text-[11px] text-muted-foreground">{terms}</p>}
      </div>
    </div>
  );
}
