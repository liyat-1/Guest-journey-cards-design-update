import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  channelPerformance,
  journeyFunnel,
  offerPerformance,
  propertyPerformance,
  results,
  segments,
} from "@/components/ota/analytics";
import {
  Bar,
  DataTable,
  DeltaTag,
  Panel,
  PanelHeader,
  ResultTile,
  SectionHeading,
  Td,
} from "@/components/ota/ui";
import { FilterBar } from "@/components/ota/FilterBar";
import { useScale } from "@/components/ota/scale";

const title = "Performance — OTA Buster | Directful";
const description =
  "One analytics workspace for OTA Buster: journey, guest segment, offer, channel and property performance.";

export const Route = createFileRoute("/ota-buster/performance")({
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
  component: PerformancePage,
});

const views = ["Journey", "Guest segments", "Offers", "Channels", "Properties"] as const;
type View = (typeof views)[number];

function JourneyView() {
  const scale = useScale();
  const max = Math.max(...journeyFunnel.map((s) => s.reached));
  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader
          title="Journey performance"
          hint="How many guests each stage reaches, and what it converts."
        />
        <div className="mt-4 space-y-4">
          {journeyFunnel.map((s) => (
            <div key={s.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[13.5px] font-semibold text-foreground">{s.name}</p>
                <p className="text-[12.5px] text-muted-foreground">
                  <span className="font-semibold text-foreground">{scale.count(s.reached)}</span>{" "}
                  guests reached ·{" "}
                  <span className="font-semibold text-foreground">{scale.count(s.converted)}</span>{" "}
                  direct conversions ·{" "}
                  <span className="font-semibold text-foreground">{scale.value(s.revenue)}</span>{" "}
                  direct revenue
                </p>
              </div>
              <div className="mt-2">
                <Bar value={s.reached} max={max} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SegmentView() {
  const scale = useScale();
  return (
    <Panel>
      <PanelHeader
        title="Guest segment performance"
        hint="Which guests respond, and what they respond to."
      />
      <div className="mt-4">
        <DataTable
          columns={[
            "Segment",
            "Guests",
            "Conversion rate",
            "Direct revenue",
            "Revenue per guest",
            "Best offer",
          ]}
        >
          {segments.map((s) => (
            <tr key={s.id}>
              <Td align="left" strong>
                {s.name}
              </Td>
              <Td>{scale.count(s.guests)}</Td>
              <Td strong>
                <span className="inline-flex items-center gap-2">
                  {scale.value(s.conversionRate)}
                  <DeltaTag delta={s.delta} />
                </span>
              </Td>
              <Td strong>{scale.value(s.directRevenue)}</Td>
              <Td>{s.revenuePerGuest}</Td>
              <Td>{s.bestOffer}</Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </Panel>
  );
}

function OfferView() {
  const scale = useScale();
  return (
    <Panel>
      <PanelHeader
        title="Offer performance"
        hint="Every incentive, what it costs you and what it returns."
      />
      <div className="mt-4">
        <DataTable
          columns={[
            "Offer",
            "Guests reached",
            "Conversions",
            "Conversion rate",
            "Direct revenue",
            "Commission avoided",
            "Best segment",
          ]}
        >
          {offerPerformance.map((o) => (
            <tr key={o.id}>
              <Td align="left" strong>
                {o.name}
              </Td>
              <Td>{scale.count(o.reached)}</Td>
              <Td>{scale.count(o.conversions)}</Td>
              <Td strong>
                <span className="inline-flex items-center gap-2">
                  {scale.value(o.conversionRate)}
                  <DeltaTag delta={o.delta} />
                </span>
              </Td>
              <Td strong>{scale.value(o.revenue)}</Td>
              <Td>{scale.value(o.commissionAvoided)}</Td>
              <Td>{o.bestSegment}</Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </Panel>
  );
}

function ChannelView() {
  const scale = useScale();
  return (
    <Panel>
      <PanelHeader title="Channel performance" hint="Email against text, on the same measures." />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {channelPerformance.map((c) => (
          <div key={c.id} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-[14.5px] font-semibold text-foreground">{c.name}</p>
              <DeltaTag delta={c.delta} suffix="conversion rate" />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2.5">
              {[
                ["Messages sent", scale.value(c.sent)],
                ["Open rate", scale.value(c.openRate)],
                ["Click-through rate", scale.value(c.ctr)],
                ["Direct conversions", scale.count(c.conversions)],
                ["Conversion rate", scale.value(c.conversionRate)],
                ["Direct revenue", scale.value(c.revenue)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11.5px] text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PropertyView() {
  const scale = useScale();
  return (
    <Panel>
      <PanelHeader
        title="Property performance"
        hint="OTA Buster results across every connected property."
      />
      <div className="mt-4">
        <DataTable
          columns={[
            "Property",
            "OTA guests",
            "Guests reached",
            "Direct conversions",
            "Conversion rate",
            "Direct revenue",
            "Commission avoided",
          ]}
        >
          {propertyPerformance.map((p) => (
            <tr key={p.id}>
              <Td align="left" strong>
                {p.name}
              </Td>
              <Td>{scale.value(p.otaGuests)}</Td>
              <Td>{scale.value(p.reached)}</Td>
              <Td>{scale.count(p.conversions)}</Td>
              <Td strong>{scale.value(p.conversionRate)}</Td>
              <Td strong>{scale.value(p.revenue)}</Td>
              <Td>{scale.value(p.commission)}</Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </Panel>
  );
}

function PerformancePage() {
  const scale = useScale();
  const [view, setView] = useState<View>("Journey");

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Performance"
        subtitle="Every OTA Buster analytics view in one place. Filter by date, property, offer and segment."
      />

      <div className="-mx-6 border-y border-border bg-card">
        <FilterBar />
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
        {results.map((r) => (
          <ResultTile key={r.id} {...r} value={scale.value(r.value)} />
        ))}
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border">
        {views.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`relative px-3 pb-2.5 text-[13px] font-medium transition-colors ${
              view === v ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {v}
            <span
              className={`absolute inset-x-2 -bottom-px h-[2px] rounded-full ${view === v ? "bg-primary" : "bg-transparent"}`}
            />
          </button>
        ))}
      </div>

      {view === "Journey" && <JourneyView />}
      {view === "Guest segments" && <SegmentView />}
      {view === "Offers" && <OfferView />}
      {view === "Channels" && <ChannelView />}
      {view === "Properties" && <PropertyView />}
    </div>
  );
}
