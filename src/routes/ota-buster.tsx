import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Bell, Users, Zap } from "lucide-react";
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

function OtaHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scale = useScale();
  const otaGuests = scale.value(results.find((r) => r.id === "ota-guests")?.value ?? "");

  return (
    <div className="bg-card">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-start gap-4 px-6 pt-6">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-card">
            <Zap className="size-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h1 className="text-[22px] leading-tight font-semibold tracking-[-0.02em] text-foreground">
              OTA Buster
            </h1>
            <p className="mt-0.5 text-[13.5px] text-muted-foreground">
              Turn OTA guests into direct guests.
            </p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary">
              <Users className="size-3.5" strokeWidth={2} />
              {otaGuests} OTA guests in the journey
            </p>
          </div>
        </div>
      </div>

      <nav className="mx-auto mt-5 flex w-full max-w-[1240px] gap-1 overflow-x-auto border-b border-border px-6">
        {nav.map((n) => {
          const on = n.exact
            ? pathname === n.to || pathname.startsWith("/ota-buster/stage")
            : pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`relative shrink-0 px-3 pb-3 text-[13.5px] font-medium transition-colors ${
                on ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {n.label}
              <span
                className={`absolute inset-x-2 -bottom-px h-[2px] rounded-full ${on ? "bg-primary" : "bg-transparent"}`}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Shell() {
  const { sidebarCollapsed, toggleSidebar } = useOta();
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-6">
          <p className="text-[15px] font-semibold text-foreground">OTA Buster</p>
          <div className="ml-auto flex items-center gap-4">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <Bell className="size-4" strokeWidth={1.75} />
            </span>
          </div>
        </header>

        <OtaHeader />

        <main className="mx-auto w-full max-w-[1240px] px-6 py-8">
          <Outlet />
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
