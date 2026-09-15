import type { MouseEvent, ReactNode } from "react";
import { ChevronDown, Info, Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Delta } from "./analytics";

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-balance-tight text-[21px] font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`premium-panel edge-sheen p-5 sm:p-6 ${className}`}>{children}</section>
  );
}


export function PanelHeader({
  eyebrow,
  title,
  hint,
  action,
}: {
  eyebrow?: string;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[10.5px] font-semibold tracking-[0.14em] text-primary uppercase">
            {eyebrow}
          </p>
        )}
        <h3 className="mt-1 text-[16px] font-semibold tracking-[-0.01em] text-foreground">
          {title}
        </h3>
        {hint && <p className="mt-1 max-w-xl text-[13px] text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ status }: { status: "Active" | "Inactive" | "Draft" | "Recovery" }) {
  const tone =
    status === "Active"
      ? "bg-success/12 text-success"
      : status === "Recovery"
        ? "bg-destructive/10 text-destructive"
        : "bg-secondary text-muted-foreground";
  const dot =
    status === "Active"
      ? "bg-success"
      : status === "Recovery"
        ? "bg-destructive"
        : "bg-border-strong";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${tone}`}
    >
      <span className={`size-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "gold" | "success";
}) {
  const tones = {
    neutral: "border-border bg-secondary/70 text-muted-foreground",
    primary: "border-primary/25 bg-primary-soft/70 text-primary",
    gold: "border-gold/45 foil text-[oklch(0.46_0.1_82)]",
    success: "border-success/25 bg-success/10 text-success",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold ${tones}`}
    >
      {children}
    </span>
  );
}

export function Btn({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  className = "",
  disabled,
  title,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "soft";
  size?: "sm" | "md";
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  title?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const sizes = size === "sm" ? "h-10 px-4 text-[13px]" : "h-11 px-5 text-[14px]";
  const variants = {
    primary:
      "brand-gradient text-primary-foreground shadow-raise hover:shadow-glow hover:brightness-[1.06]",
    secondary:
      "border border-border bg-card text-foreground shadow-card hover:border-border-strong hover:bg-secondary/70",
    soft: "bg-primary-soft/80 text-primary hover:bg-primary-soft",
    ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
    danger: "border border-destructive/30 bg-card text-destructive hover:bg-destructive/10",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${base} ${sizes} ${variants} ${className}`}
    >
      {children}
    </button>
  );
}


/** Small labelled dropdown used across the filter bar and editors. */
export function Field({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-input bg-card pr-8 pl-3 text-[12.5px] font-medium text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export function InfoTip({ children }: { children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="How this is calculated"
          className="inline-grid size-4 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        >
          <Info className="size-3.5" strokeWidth={2} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] text-[12px] leading-relaxed">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

export function DeltaTag({ delta, suffix }: { delta: Delta; suffix?: string }) {
  const Icon =
    delta.direction === "up" ? TrendingUp : delta.direction === "down" ? TrendingDown : Minus;
  const tone =
    delta.direction === "up"
      ? "text-success"
      : delta.direction === "down"
        ? "text-destructive"
        : "text-muted-foreground";
  return (
    <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold ${tone}`}>
      <Icon className="size-3" strokeWidth={2.4} />
      {delta.value}
      {suffix && <span className="font-medium text-muted-foreground">{suffix}</span>}
    </span>
  );
}

/** Primary outcome tile. The label always states what the number counts. */
export function ResultTile({
  label,
  value,
  context,
  delta,
  method,
  emphasis,
}: {
  label: string;
  value: string;
  context?: string;
  delta?: Delta;
  method?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`premium-panel edge-sheen relative flex min-h-[148px] flex-col overflow-hidden rounded-2xl px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-float ${
        emphasis ? "border-primary/25 bg-gradient-to-br from-primary-soft/60 to-card" : ""
      }`}
    >
      {emphasis && (
        <span className="absolute inset-x-0 top-0 h-[2px] bg-primary/70" aria-hidden />
      )}
      <div className="flex items-start gap-1.5">
        <p className="text-[10.5px] leading-[1.35] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          {label}
        </p>
        {method && <InfoTip>{method}</InfoTip>}
      </div>
      <p className="mt-2.5 text-[26px] leading-none font-semibold tracking-[-0.035em] text-foreground tabular-nums">
        {value}
      </p>
      {delta && (
        <p className="mt-2">
          <DeltaTag delta={delta} suffix="vs prev" />
        </p>
      )}
      {context && (
        <p className="mt-auto pt-2 text-[11px] leading-snug text-muted-foreground">{context}</p>
      )}
    </div>
  );
}



export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border-strong bg-gradient-to-b from-primary-soft/40 to-card px-6 py-12 text-center">
      <p className="text-[15px] font-semibold text-foreground">{title}</p>
      <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
        {body}
      </p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

/**
 * A single data point. Reads as a measurement: quiet label, confident number.
 */
export function DataPoint({
  label,
  value,
  hint,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: Delta;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-gradient-to-b from-secondary/60 to-secondary/25 px-3.5 py-3">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="size-3 shrink-0 text-muted-foreground" strokeWidth={2} />}
        <p className="truncate text-[10.5px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          {label}
        </p>
      </div>
      <p className="mt-1.5 text-[18px] leading-none font-semibold tracking-[-0.025em] text-foreground tabular-nums">
        {value}
      </p>
      {delta && (
        <p className="mt-1.5">
          <DeltaTag delta={delta} />
        </p>
      )}
      {hint && <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Metric({
  label,
  value,
  hint,
  delta,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: Delta;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-card transition-shadow hover:shadow-raise">
      <p className="text-[11.5px] leading-tight font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-[20px] leading-none font-semibold tracking-[-0.02em] text-foreground">
        {value}
      </p>
      {delta && (
        <p className="mt-1.5">
          <DeltaTag delta={delta} suffix="vs previous" />
        </p>
      )}
      {hint && <p className="mt-1.5 text-[11.5px] leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Bar({
  value,
  max,
  tone = "primary",
}: {
  value: number;
  max: number;
  tone?: "primary" | "gold" | "success";
}) {
  const pct = max > 0 ? Math.max(3, Math.round((value / max) * 100)) : 0;
  const color = tone === "gold" ? "bg-gold" : tone === "success" ? "bg-success" : "bg-primary";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Shared table shell so every analytics view reads the same way. */
export function DataTable({ columns, children }: { columns: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead>
          <tr className="border-b border-border">
            {columns.map((c, i) => (
              <th
                key={c}
                className={`pb-2.5 text-[11px] font-semibold tracking-[0.05em] text-muted-foreground uppercase ${
                  i === 0 ? "" : "text-right"
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  align = "right",
  strong,
}: {
  children: ReactNode;
  align?: "left" | "right";
  strong?: boolean;
}) {
  return (
    <td
      className={`py-3 text-[13px] ${align === "right" ? "text-right" : ""} ${
        strong ? "font-semibold text-foreground" : "text-muted-foreground"
      }`}
    >
      {children}
    </td>
  );
}
