import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Bell, Search, Sparkles, Users, Zap } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/directful/AppSidebar";
import { OtaProvider, useOta } from "@/components/ota/state";
import { results } from "@/components/ota/analytics";
import { useScale } from "@/components/ota/scale";

export const Route = createFileRoute("/ota-buster")({
  component: OtaBusterLayout,
});

const nav: { to: string; label: string; exact?: boolean }[] = [
  { to: "/ota-buster", label: "Guest journey", exact: true },
  { to: "/ota-buster/performance", label: "Performance" },
  { to: "/ota-buster/segments", label: "Guest segments" },
  { to: "/ota-buster/settings", label: "Settings" },
];

const shellWidth = "mx-auto w-full max-w-[1180px] px-5 sm:px-8";

/** The workspace hero: brand band, live scale of the programme, tab rail. */
function OtaHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scale = useScale();
  const otaGuests = scale.value(results.find((r) => r.id === "ota-guests")?.value ?? "");
  const recovered = scale.value(results.find((r) => r.id === "revenue")?.value ?? "");

  if (pathname === "/ota-buster/performance") {
    return (
      <div className="border-b border-border bg-card">
        <div className={`${shellWidth} flex min-h-16 items-center gap-5`}>
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-raise">
              <Zap className="size-4.5" strokeWidth={2.2} />
            </span>
            <span className="font-display text-[15px] font-semibold text-foreground">OTA Buster</span>
          </div>
          <nav className="ml-auto flex min-w-0 gap-1 overflow-x-auto">
            {nav.map((n) => {
              const on = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`shrink-0 rounded-lg px-3 py-2 text-[12.5px] font-semibold transition-colors ${
                    on ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="brand-gradient absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.16]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(28rem 14rem at 12% 0%, white, transparent), radial-gradient(26rem 16rem at 88% 110%, white, transparent)",
        }}
      />

      <div className={`relative ${shellWidth} pt-8 pb-0`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/25 backdrop-blur">
              <Zap className="size-[22px]" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="text-[10.5px] font-semibold tracking-[0.18em] text-primary-foreground/70 uppercase">
                Direct booking programme
              </p>
              <h1 className="text-balance-tight mt-1 text-[27px] leading-tight font-semibold text-primary-foreground sm:text-[31px]">
                OTA Buster
              </h1>
              <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-primary-foreground/75">
                Turn commission-heavy OTA guests into repeat direct guests, stage by stage.
              </p>
            </div>
          </div>

          <dl className="flex flex-wrap gap-2.5">
            <div className="rounded-2xl bg-primary-foreground/10 px-4 py-3 ring-1 ring-primary-foreground/20 backdrop-blur">
              <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.12em] text-primary-foreground/70 uppercase">
                <Users className="size-3" strokeWidth={2.2} /> In journey
              </dt>
              <dd className="mt-1 text-[19px] leading-none font-semibold tracking-[-0.02em] text-primary-foreground tabular-nums">
                {otaGuests}
              </dd>
            </div>
            <div className="rounded-2xl bg-primary-foreground/10 px-4 py-3 ring-1 ring-primary-foreground/20 backdrop-blur">
              <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.12em] text-primary-foreground/70 uppercase">
                <Sparkles className="size-3" strokeWidth={2.2} /> Direct revenue
              </dt>
              <dd className="mt-1 text-[19px] leading-none font-semibold tracking-[-0.02em] text-primary-foreground tabular-nums">
                {recovered}
              </dd>
            </div>
          </dl>
        </div>

        <nav className="mt-7 -mb-px flex gap-1 overflow-x-auto pb-0">
          {nav.map((n) => {
            const on = n.exact
              ? pathname === n.to || pathname.startsWith("/ota-buster/stage")
              : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`shrink-0 rounded-t-xl px-4 pt-2.5 pb-3 text-[13px] font-semibold transition-all ${
                  on
                    ? "bg-background text-foreground shadow-[0_-6px_18px_-12px_rgba(0,0,0,0.4)]"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function Shell() {
  const { sidebarCollapsed, toggleSidebar } = useOta();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-bar sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border px-5 sm:px-8">
          <p className="text-[14px] font-semibold tracking-[-0.01em] text-foreground">
            Directful <span className="text-muted-foreground">/ OTA Buster</span>
          </p>
          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden h-9 items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 text-[12.5px] text-muted-foreground sm:flex">
              <Search className="size-3.5" strokeWidth={2} /> Search guests, offers…
            </span>
            <span className="relative grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground">
              <Bell className="size-4" strokeWidth={1.9} />
              <span className="absolute top-1.5 right-2 size-1.5 rounded-full bg-destructive ring-2 ring-card" />
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-primary text-[11.5px] font-semibold text-primary-foreground shadow-glow">
              WG
            </span>
          </div>
        </header>

        <OtaHeader />

        <main className={`${pathname === "/ota-buster/performance" ? "bg-background" : "app-canvas"} min-h-[70vh] flex-1`}>
          <div className={`${shellWidth} py-8 sm:py-10`}>
            <div className="rise-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function OtaBusterLayout() {
  return (
    <TooltipProvider delayDuration={120}>
      <OtaProvider>
        <Shell />
        <Toaster />
      </OtaProvider>
    </TooltipProvider>
  );
}
