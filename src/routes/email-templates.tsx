import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, ChevronDown, Plus, Search } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppSidebar } from "@/components/directful/AppSidebar";
import { TemplateCard } from "@/components/directful/TemplateCard";
import { EmailPreview } from "@/components/directful/EmailPreview";
import { templates, type Template } from "@/components/directful/templates";

const title = "Email templates — Directful";
const description =
  "Create and manage reusable email designs for your guest campaigns across every property.";

export const Route = createFileRoute("/email-templates")({
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
  component: EmailTemplatesPage,
});

const filters = ["All", "Active", "Draft", "Default"] as const;

function EmailTemplatesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [preview, setPreview] = useState<Template | null>(null);

  const visible = useMemo(
    () =>
      templates.filter((t) => {
        const matchesQuery = (t.name + t.description).toLowerCase().includes(query.toLowerCase());
        const matchesFilter =
          filter === "All" || (filter === "Default" ? Boolean(t.isDefault) : t.status === filter);
        return matchesQuery && matchesFilter;
      }),
    [query, filter],
  );

  return (
    <TooltipProvider delayDuration={120}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-6">
            <p className="text-[15px] font-semibold text-foreground">Email design</p>
            <div className="ml-auto flex items-center gap-4">
              <span className="hidden text-[12.5px] text-muted-foreground sm:inline">01:21 PM</span>
              <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
                <Bell className="size-4" strokeWidth={1.75} />
              </span>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1240px] px-6 py-10">
            {/* Page header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10.5px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Marketing assets
                </p>
                <h1 className="mt-1.5 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-foreground">
                  Email templates
                </h1>
                <p className="mt-2 max-w-xl text-[14px] text-muted-foreground">
                  Create and manage reusable email designs for your guest campaigns.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[13.5px] font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary/90"
              >
                <Plus className="size-4" strokeWidth={2.25} /> Create template
              </button>
            </div>

            {/* Toolbar */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="relative w-full max-w-[280px]">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search templates..."
                  aria-label="Search templates"
                  className="h-10 w-full rounded-md border border-input bg-card pr-3 pl-9 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-card px-3.5 text-[13.5px] text-foreground transition-colors hover:bg-secondary"
              >
                All templates <ChevronDown className="size-4 text-muted-foreground" />
              </button>

              <div className="flex items-center gap-1 rounded-md border border-input bg-card p-1">
                {filters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`h-8 rounded-[5px] px-3 text-[12.5px] font-medium transition-colors ${
                      filter === f
                        ? "bg-primary-soft text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Library */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <button
                type="button"
                className="group flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border-strong bg-primary-soft/35 p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary-soft/60"
              >
                <span className="grid size-11 place-items-center rounded-md bg-primary text-primary-foreground shadow-card transition-transform group-hover:scale-105">
                  <Plus className="size-5" strokeWidth={2.25} />
                </span>
                <span className="text-[15.5px] font-semibold text-foreground">
                  Create new template
                </span>
                <span className="max-w-[220px] text-[13px] leading-relaxed text-muted-foreground">
                  Start from scratch and create a reusable email design.
                </span>
                <span className="mt-2 inline-flex h-9 items-center rounded-md bg-primary px-4 text-[12.5px] font-semibold text-primary-foreground">
                  Create template
                </span>
              </button>

              {visible.map((t) => (
                <TemplateCard key={t.id} template={t} onPreview={setPreview} />
              ))}
            </div>

            {visible.length === 0 && (
              <p className="mt-6 text-[13.5px] text-muted-foreground">
                No templates match your search.
              </p>
            )}

            {/* Footer note */}
            <div className="mt-10 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-card">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-foreground">Need inspiration?</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Explore best practices and design tips for high-performing guest emails.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-md border border-input bg-card px-4 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                View guidelines
              </button>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={Boolean(preview)} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-[480px] p-0">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-[15px]">{preview?.name} preview</DialogTitle>
          </DialogHeader>
          <div className="p-5">
            <div className="h-[520px] overflow-hidden rounded-md border border-border bg-white">
              {preview && <EmailPreview variant={preview.variant} />}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </TooltipProvider>
  );
}
