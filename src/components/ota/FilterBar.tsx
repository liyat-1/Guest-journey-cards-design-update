import { useState } from "react";
import { CalendarDays, Check, Filter, RotateCcw } from "lucide-react";
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
import { Btn, Field } from "./ui";

/**
 * One global filter bar. The date range is always visible; the remaining
 * dimensions stay tucked away so the workspace keeps its whitespace.
 */
export function FilterBar() {
  const { filters, setFilter, resetFilters, activeFilterCount } = useOta();
  const [open, setOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [comparison, setComparison] = useState("No comparison");

  return (
    <div className="relative z-20 rounded-xl border border-border bg-card p-2 shadow-card">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex">
        <Field
          label="Property"
          value={filters.property}
          options={propertyOptions}
          onChange={(v) => setFilter("property", v)}
          className="min-w-0 sm:w-[230px]"
        />

        <div className="relative sm:ml-auto">
          <Btn
            variant="secondary"
            size="sm"
            onClick={() => setPeriodOpen((value) => !value)}
            className="w-full justify-between sm:w-auto"
          >
            <CalendarDays className="size-4 text-muted-foreground" />
            <span>{filters.range}</span>
            {comparison !== "No comparison" && (
              <span className="rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] text-primary">
                Compared
              </span>
            )}
          </Btn>
          {periodOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 z-30 w-[290px] rounded-xl border border-border bg-popover p-3 shadow-pop">
              <p className="mb-2 text-[11px] font-semibold text-muted-foreground">Date range</p>
              <Field
                label="Date range"
                value={filters.range}
                options={dateRanges}
                onChange={(v) => setFilter("range", v)}
              />
              <div className="my-3 border-t border-border" />
              <p className="mb-2 text-[11px] font-semibold text-muted-foreground">Compare to</p>
              <Field
                label="Comparison period"
                value={comparison}
                options={["No comparison", "Previous period", "Same period last year"]}
                onChange={setComparison}
              />
              <button
                type="button"
                onClick={() => setPeriodOpen(false)}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground"
              >
                <Check className="size-3.5" /> Apply period
              </button>
            </div>
          )}
        </div>

        <Btn variant={open || activeFilterCount > 0 ? "soft" : "ghost"} size="sm" onClick={() => setOpen((v) => !v)}>
          <Filter className="size-3.5" strokeWidth={2} />
          More filters
          {activeFilterCount > 0 && (
            <span className="grid size-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Btn>

        {activeFilterCount > 0 && (
          <Btn variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="size-3.5" strokeWidth={2} />
            Clear
          </Btn>
        )}
      </div>

      {open && (
        <div className="mt-2 grid gap-2 border-t border-border pt-2 sm:grid-cols-2 lg:grid-cols-6">
          <Field
            label="Stage"
            value={filters.stage}
            options={stageOptions}
            onChange={(v) => setFilter("stage", v)}
          />
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
