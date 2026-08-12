import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Btn, Panel, PanelHeader, SectionHeading } from "@/components/ota/ui";
import { useOta } from "@/components/ota/state";
import { property } from "@/components/ota/journey";
import type { OfferType } from "@/components/ota/stage-config";
import propertyHero from "@/assets/property-hero.jpg";

const title = "Settings — OTA Buster | Directful";
const description =
  "Choose which OTA bookings enter OTA Buster, set guest eligibility, edit your offer types, booking engine, tracking and consent.";

export const Route = createFileRoute("/ota-buster/settings")({
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
  component: SettingsPage,
});

const groups = [
  {
    title: "Which OTA bookings enter OTA Buster?",
    items: [
      { label: "Booking.com", detail: "412 bookings this period", on: true },
      { label: "Expedia", detail: "268 bookings this period", on: true },
      { label: "Agoda", detail: "104 bookings this period", on: true },
      { label: "Trip.com", detail: "58 bookings this period", on: false },
      { label: "Other OTAs", detail: "76 bookings this period", on: false },
    ],
  },
  {
    title: "Guest eligibility",
    items: [
      { label: "Stayed at least one night", detail: "Skip cancellations and no-shows", on: true },
      { label: "Only guests with a valid email", detail: "Required for the journey", on: true },
      { label: "Exclude corporate contracts", detail: "Negotiated rates are excluded", on: false },
    ],
  },
  {
    title: "Booking engine & tracking",
    items: [
      {
        label: "Direct booking engine connected",
        detail: "SynXis · Wyndham Grand Levent",
        on: true,
      },
      {
        label: "Track conversions end-to-end",
        detail: "Attribute direct revenue to OTA Buster",
        on: true,
      },
      { label: "Send offer codes automatically", detail: "One-time code per guest", on: true },
    ],
  },
  {
    title: "Communication & consent",
    items: [
      { label: "Email", detail: "Primary channel for all stages", on: true },
      { label: "SMS", detail: "Used for arrival reminders only", on: false },
      { label: "Respect marketing consent", detail: "Only contact guests who opted in", on: true },
    ],
  },
];

function Row({ label, detail, on }: { label: string; detail: string; on: boolean }) {
  const [checked, setChecked] = useState(on);
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-foreground">{label}</p>
        <p className="text-[12px] text-muted-foreground">{detail}</p>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} aria-label={label} />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  textarea,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: "text" | "number";
  hint?: string;
}) {
  const cls =
    "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-[13px] text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";
  return (
    <label className="block">
      <span className="text-[11.5px] font-medium text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
      {hint && <span className="mt-1 block text-[11.5px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

/** What the guest actually sees — warm, personal, property-branded. */
function OfferLandingPreview({ offer }: { offer: OfferType }) {
  const headline = offer.discount > 0 ? `${offer.discount}% off your next direct stay` : offer.name;
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative">
        <img
          src={propertyHero}
          alt={`Terrace lounge at ${property}`}
          width={1024}
          height={640}
          loading="lazy"
          className="h-[168px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/45" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-background uppercase">
            {property}
          </p>
          <p className="mt-1 font-serif text-[19px] leading-tight text-background">
            Welcome back, Sarah
          </p>
        </div>
      </div>
      <div className="p-4">
        <p className="font-serif text-[18px] leading-snug text-foreground">{headline}</p>
        {offer.benefits.length > 0 && (
          <ul className="mt-2 space-y-1">
            {offer.benefits.map((b) => (
              <li key={b} className="text-[12.5px] text-muted-foreground">
                · {b}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
          {offer.messaging || offer.description}
        </p>
        <span className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-[13px] font-semibold text-primary-foreground">
          Book direct
        </span>
        <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
          {offer.expiry} · {offer.conditions}
        </p>
      </div>
    </div>
  );
}

function OfferTypes() {
  const { offerTypes, updateOfferType } = useOta();
  const [selectedId, setSelectedId] = useState(offerTypes[0]!.id);
  const offer = offerTypes.find((o) => o.id === selectedId) ?? offerTypes[0]!;

  return (
    <Panel>
      <PanelHeader
        title="Offer types"
        hint="The incentives available to every stage. Edit one and the change flows through the journey."
      />
      <div className="mt-4 grid gap-5 lg:grid-cols-[240px_1fr_260px]">
        <div className="space-y-1">
          {offerTypes.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setSelectedId(o.id)}
              className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                o.id === offer.id
                  ? "bg-primary-soft/70 text-primary"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <span className="block text-[13px] font-semibold">{o.name}</span>
              <span className="mt-0.5 block text-[11.5px] text-muted-foreground">
                {o.usedIn.length > 0 ? `Used in ${o.usedIn.join(", ")}` : "Not in use"} · {o.cost}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <TextField
            label="Offer name"
            value={offer.name}
            onChange={(v) => updateOfferType(offer.id, { name: v })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label="Discount percentage"
              type="number"
              value={String(offer.discount)}
              onChange={(v) => updateOfferType(offer.id, { discount: Number(v) || 0 })}
            />
            <TextField
              label="Cost to the hotel"
              value={offer.cost}
              onChange={(v) => updateOfferType(offer.id, { cost: v })}
            />
          </div>
          <TextField
            label="Benefits"
            value={offer.benefits.join("\n")}
            hint="One benefit per line."
            textarea
            onChange={(v) =>
              updateOfferType(offer.id, {
                benefits: v.split("\n").filter((b) => b.trim().length > 0),
              })
            }
          />
          <TextField
            label="Description"
            value={offer.description}
            textarea
            onChange={(v) => updateOfferType(offer.id, { description: v })}
          />
          <TextField
            label="Eligibility"
            value={offer.eligibility}
            onChange={(v) => updateOfferType(offer.id, { eligibility: v })}
          />
          <TextField
            label="Conditions"
            value={offer.conditions}
            onChange={(v) => updateOfferType(offer.id, { conditions: v })}
          />
          <TextField
            label="Expiration"
            value={offer.expiry}
            onChange={(v) => updateOfferType(offer.id, { expiry: v })}
          />
          <TextField
            label="Associated messaging"
            value={offer.messaging}
            textarea
            onChange={(v) => updateOfferType(offer.id, { messaging: v })}
          />
        </div>

        <div>
          <p className="text-[11.5px] font-medium text-muted-foreground">What the guest sees</p>
          <div className="mt-1.5">
            <OfferLandingPreview offer={offer} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Settings"
        subtitle="Decide who enters OTA Buster, how guests are contacted, and which incentives are available."
        action={
          <Btn variant="secondary" onClick={() => toast.success("Settings saved")}>
            Save changes
          </Btn>
        }
      />

      <OfferTypes />

      <div className="grid gap-5 lg:grid-cols-2">
        {groups.map((g) => (
          <section key={g.title} className="rounded-xl border border-border bg-card shadow-card">
            <h2 className="border-b border-border px-4 py-3.5 text-[13.5px] font-semibold text-foreground">
              {g.title}
            </h2>
            <div className="divide-y divide-border">
              {g.items.map((i) => (
                <Row key={i.label} {...i} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
