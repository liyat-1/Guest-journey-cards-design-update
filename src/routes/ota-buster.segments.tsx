import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { results, segments, type Segment } from "@/components/ota/analytics";
import { Bar, DeltaTag, Panel, ResultTile, SectionHeading } from "@/components/ota/ui";
import { useScale } from "@/components/ota/scale";

const title = "Guest segments — OTA Buster | Directful";
const description =
  "How each OTA guest segment responds: conversion rate, direct revenue, best offer and the recommended incentive.";

export const Route = createFileRoute("/ota-buster/segments")({
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
  component: SegmentsPage,
});

function SegmentCard({
  segment,
  max,
  selected,
  onSelect,
}: {
  segment: Segment;
  max: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const scale = useScale();
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-5 text-left transition-all ${
        selected
          ? "border-primary/35 bg-primary-soft/20"
          : "border-border bg-card hover:border-primary/25"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
            {segment.name}
          </p>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            {scale.count(segment.guests)} guests · {segment.share}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[19px] leading-none font-semibold tracking-[-0.02em] text-foreground">
            {scale.value(segment.conversionRate)}
          </p>
          <p className="mt-1 text-[11.5px] text-muted-foreground">Conversion rate</p>
          <p className="mt-1">
            <DeltaTag delta={segment.delta} />
          </p>
        </div>
      </div>

      <div className="mt-3.5">
        <Bar value={segment.guests} max={max} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {[
          ["Direct revenue", scale.value(segment.directRevenue)],
          ["Revenue per guest", segment.revenuePerGuest],
          ["Best offer", segment.bestOffer],
          ["Best channel", segment.bestChannel],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11.5px] text-muted-foreground">{k}</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      {selected && (
        <p className="mt-4 border-t border-border pt-3.5 text-[12.5px] leading-relaxed text-foreground">
          <span>
            <span className="font-semibold">Recommended incentive · </span>
            {segment.recommendation}
          </span>
        </p>
      )}
    </button>
  );
}

function SegmentsPage() {
  const scale = useScale();
  const [selected, setSelected] = useState<string>(segments[0]!.id);
  const max = Math.max(...segments.map((s) => s.guests));
  const headline = results.filter((r) => ["ota-guests", "profiles", "conversions"].includes(r.id));

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Guest segments"
        subtitle="OTA Buster works across hundreds of thousands of guests, so everything here is aggregate — how each segment behaves, and what converts it."
      />

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {headline.map((r) => (
          <ResultTile key={r.id} {...r} value={scale.value(r.value)} />
        ))}
      </div>

      <div className="grid gap-3">
        {segments.map((s) => (
          <SegmentCard
            key={s.id}
            segment={s}
            max={max}
            selected={selected === s.id}
            onSelect={() => setSelected(s.id)}
          />
        ))}
      </div>

      <Panel>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Segments are assigned automatically from booking history, stay value, party composition
          and travel frequency. A guest can belong to more than one segment, so segment totals
          exceed the OTA guest count.
        </p>
      </Panel>
    </div>
  );
}
