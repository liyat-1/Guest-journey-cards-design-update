import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Info, Sparkles, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { journeyFunnel } from "@/components/ota/analytics";
import { Btn } from "@/components/ota/ui";
import { FilterBar } from "@/components/ota/FilterBar";

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

const trendData = [
  { date: "Aug 19", guests: 310 },
  { date: "Aug 21", guests: 324 },
  { date: "Aug 23", guests: 308 },
  { date: "Aug 25", guests: 311 },
  { date: "Aug 27", guests: 336 },
  { date: "Aug 29", guests: 347 },
  { date: "Aug 31", guests: 329 },
  { date: "Sep 2", guests: 292 },
];

function ReachRing() {
  return (
    <div className="relative mx-auto size-[210px] shrink-0 sm:size-[238px]">
      <svg viewBox="0 0 240 240" className="size-full -rotate-90" aria-label="31.1% of eligible guests made reachable">
        <circle cx="120" cy="120" r="92" fill="none" className="stroke-secondary" strokeWidth="24" />
        <circle cx="120" cy="120" r="92" fill="none" className="stroke-primary" strokeWidth="24" strokeLinecap="round" strokeDasharray="180 578" />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <strong className="font-display text-[38px] leading-none font-semibold text-foreground">5.0K</strong>
        <span className="mt-2 text-[12px] font-semibold text-primary">31.1% made reachable</span>
        <span className="mx-auto mt-1 max-w-[118px] text-[10.5px] leading-snug text-muted-foreground">with Level 1 enrichment</span>
      </div>
    </div>
  );
}

function PerformancePage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-primary">Analytics overview</p>
          <h1 className="font-display mt-1 text-[25px] leading-tight font-semibold text-foreground sm:text-[30px]">OTA Buster performance</h1>
          <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-muted-foreground">See how guest data becomes reachable profiles and direct-booking value.</p>
        </div>
        <div className="hidden items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-card md:flex">
          <span className="grid size-9 place-items-center rounded-lg bg-success/10 text-success"><TrendingUp className="size-4.5" /></span>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">Remaining opportunity</p>
            <p className="font-display mt-0.5 text-[18px] leading-none font-semibold text-foreground">3,000–7,100 <span className="font-sans text-[11px] font-medium text-muted-foreground">guests</span></p>
          </div>
        </div>
      </header>

      <FilterBar />

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-[17px] font-semibold text-foreground">Where your guests stand</h2>
              <p className="mt-1 text-[12px] text-muted-foreground">Aug 5 – Sep 3 · 30,000 profiles analyzed</p>
            </div>
            <span className="hidden items-center gap-1.5 text-[11px] font-medium text-muted-foreground sm:inline-flex"><Info className="size-3.5" /> Updated today</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <div className="flex flex-col items-center gap-8 p-6 sm:flex-row sm:p-8 lg:border-r lg:border-border">
            <ReachRing />
            <div className="w-full min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-muted-foreground">Eligible guest database</p>
              <p className="font-display mt-1 text-[28px] font-semibold text-foreground">16,000</p>
              <p className="mt-2 max-w-xs text-[12.5px] leading-relaxed text-muted-foreground">Profiles with enough booking data to improve reachability and future direct contact.</p>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div><dt className="text-[10.5px] text-muted-foreground">Made reachable</dt><dd className="mt-1 text-[15px] font-semibold text-foreground">5,000</dd></div>
                <div><dt className="text-[10.5px] text-muted-foreground">Still eligible</dt><dd className="mt-1 text-[15px] font-semibold text-foreground">11,000</dd></div>
              </dl>
            </div>
          </div>

          <aside className="bg-secondary/35 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10.5px] font-semibold text-muted-foreground">Reach opportunity</p>
              <span className="rounded-md bg-primary-soft px-2 py-1 text-[10.5px] font-semibold text-primary">53% analyzed</span>
            </div>
            <div className="mt-5 flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><Users className="size-4.5" /></span>
              <div className="min-w-0">
                <p className="font-display text-[16px] font-semibold text-foreground">Level 1 made 5K guests reachable</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">31.1% of eligible profiles can now receive direct communication.</p>
              </div>
            </div>
            <div className="mt-5 border-t border-border pt-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-success/10 text-success"><Sparkles className="size-3.5" /></span>
                <div>
                  <p className="text-[12.5px] font-semibold text-foreground">Level 2 could add up to 7K more</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">Additional enrichment typically recovers 30–80% of profiles currently out of reach.</p>
                </div>
              </div>
              <Btn variant="ghost" size="sm" className="mt-3 px-0 text-primary">Explore opportunity <ArrowRight className="size-3.5" /></Btn>
            </div>
          </aside>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-[17px] font-semibold text-foreground">Guests made reachable over time</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">Level 1 enrichment · Aug 19 – Sep 2</p>
          </div>
          <span className="hidden items-center gap-2 text-[11px] font-medium text-muted-foreground sm:flex"><span className="size-2 rounded-full bg-primary" /> Reachable guests</span>
        </div>
        <div className="mt-7 h-[270px] w-full sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs><linearGradient id="reachFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.14} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} dy={10} />
              <YAxis domain={[0, 400]} axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
              <Tooltip cursor={{ stroke: "var(--border-strong)", strokeDasharray: "4 4" }} contentStyle={{ border: "1px solid var(--border)", borderRadius: 8, boxShadow: "var(--shadow-pop)", fontSize: 12 }} formatter={(value) => [`${value ?? 0} guests`, "Made reachable"]} />
              <Area type="monotone" dataKey="guests" stroke="var(--primary)" strokeWidth={2.5} fill="url(#reachFill)" activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-4 text-[11.5px] text-muted-foreground"><CheckCircle2 className="size-4 text-success" /> Reach remained above 290 guests throughout the selected period.</div>
      </section>
    </div>
  );
}
