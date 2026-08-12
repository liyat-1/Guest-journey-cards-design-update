import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * One modal shell for the whole product: a calm header, a scrollable body and
 * a sticky action bar. Every overlay in OTA Buster reads the same way.
 */
export function Modal({
  open,
  onOpenChange,
  icon: Icon,
  eyebrow,
  title,
  description,
  headerExtra,
  footer,
  children,
  size = "lg",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  headerExtra?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
}) {
  const width =
    size === "md"
      ? "sm:max-w-2xl"
      : size === "xl"
        ? "sm:max-w-3xl lg:max-w-6xl"
        : "sm:max-w-3xl lg:max-w-5xl";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex max-h-[92vh] flex-col gap-0 overflow-hidden rounded-3xl border-border p-0 shadow-float ${width}`}
      >
        <DialogHeader className="relative shrink-0 space-y-0 overflow-hidden border-b border-border px-6 py-5 text-left">
          <div className="brand-gradient absolute inset-0" aria-hidden />
          <div
            className="absolute inset-0 opacity-[0.18]"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(20rem 10rem at 8% -20%, white, transparent), radial-gradient(18rem 12rem at 95% 130%, white, transparent)",
            }}
          />
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5">
            {Icon && (
              <span className="mt-0.5 grid size-10 place-items-center rounded-2xl bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/25 backdrop-blur">
                <Icon className="size-[18px]" strokeWidth={2} />
              </span>
            )}
            <div className="min-w-0">
              {eyebrow && (
                <p className="text-[10.5px] font-semibold tracking-[0.16em] text-primary-foreground/70 uppercase">
                  {eyebrow}
                </p>
              )}
              <DialogTitle className="text-balance-tight mt-0.5 text-[19px] leading-tight font-semibold text-primary-foreground">
                {title}
              </DialogTitle>
              {description && (
                <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-primary-foreground/75">
                  {description}
                </p>
              )}
            </div>
          </div>
          {headerExtra && <div className="relative mt-4">{headerExtra}</div>}
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-background">{children}</div>

        {footer && (
          <div className="glass-bar shrink-0 border-t border-border px-6 py-4">{footer}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}


/** A labelled block inside a modal body. Keeps every editor on one rhythm. */
export function ModalSection({
  label,
  hint,
  action,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`premium-panel edge-sheen p-4 sm:p-5 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {label}
          </p>
          {hint && <p className="mt-1 text-[12px] text-muted-foreground">{hint}</p>}
        </div>
        {action}
      </div>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}
