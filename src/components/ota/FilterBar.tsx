import { useState } from "react";
import { Filter, RotateCcw } from "lucide-react";
import {
  channelOptions,
  conversionOptions,
  dateRanges,
  offerOptions,
  propertyOptions,
  segmentOptions,
  sourceOptions,
  stageOptions,
} from "./analytics";
import { useOta } from "./state";
import { Field } from "./ui";

/**
 * One global filter bar. The date range is always visible; the remaining
 * dimensions stay tucked away so the workspace keeps its whitespace.
 */
export function FilterBar() {
  const { filters, setFilter, resetFilters, activeFilterCount } = useOta();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-2 px-6 py-2.5">
        <Field
          label="Date range"
          value={filters.range}
          options={dateRanges}
          onChange={(v) => setFilter("range", v)}
          className="w-[150px]"
        />
        <Field
          label="Property"
          value={filters.property}
          options={propertyOptions}
          onChange={(v) => setFilter("property", v)}
          className="w-[230px]"
        />

        <Field
          label="Stage"
          value={filters.stage}
          options={stageOptions}
          onChange={(v) => setFilter("stage", v)}
          className="w-[150px]"
        />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[12.5px] font-medium transition-colors ${
            open || activeFilterCount > 0
              ? "border-primary/30 bg-primary-soft/60 text-primary"
              : "border-input bg-card text-muted-foreground hover:text-foreground"
          }`}
          aria-expanded={open}
        >
          <Filter className="size-3.5" strokeWidth={2} />
          Filters
          {activeFilterCount > 0 && (
            <span className="grid size-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" strokeWidth={2} />
            Clear
          </button>
        )}

        <p className="ml-auto hidden text-[12px] text-muted-foreground lg:block">
          All metrics below reflect these filters.
        </p>
      </div>

      {open && (
        <div className="mx-auto grid w-full max-w-[1240px] gap-2 px-6 pb-3 sm:grid-cols-2 lg:grid-cols-5">
          <Field
            label="Channel"
            value={filters.channel}
            options={channelOptions}
            onChange={(v) => setFilter("channel", v)}
          />
          <Field
            label="Guest segment"
            value={filters.segment}
            options={segmentOptions}
            onChange={(v) => setFilter("segment", v)}
          />
          <Field
            label="Source"
            value={filters.source}
            options={sourceOptions}
            onChange={(v) => setFilter("source", v)}
          />
          <Field
            label="Offer"
            value={filters.offer}
            options={offerOptions}
            onChange={(v) => setFilter("offer", v)}
          />
          <Field
            label="Conversion status"
            value={filters.conversion}
            options={conversionOptions}
            onChange={(v) => setFilter("conversion", v)}
          />
        </div>
      )}
    </div>
  );
}
