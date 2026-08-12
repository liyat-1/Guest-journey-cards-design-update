import { MessageSquareWarning, Star } from "lucide-react";
import { Panel, PanelHeader } from "./ui";

/**
 * What happens after a guest leaves a rating. Positive ratings are routed to a
 * public review, negative ones to a private recovery conversation.
 */
export function ReviewExperience({ property }: { property: string }) {
  return (
    <Panel className="lg:col-span-2">
      <PanelHeader
        eyebrow="Step 3 · Review experience"
        title="What happens after the guest rates the stay"
        hint="The rating decides the next screen — public review for happy guests, private recovery for unhappy ones."
      />
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-border p-4">
          <p className="flex items-center gap-2 text-[12px] font-semibold text-foreground">
            <Star className="size-4 text-gold" strokeWidth={2} /> 4–5 stars · Public review
          </p>
          <div className="mt-3 rounded-xl bg-secondary/40 px-4 py-5 text-center">
            <p className="font-serif text-[18px] text-foreground">Thank you, Sarah.</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
              Would you share that with future guests of {property}?
            </p>
            <span className="mt-3 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-[12.5px] font-semibold text-primary-foreground">
              Write a Google review
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="flex items-center gap-2 text-[12px] font-semibold text-foreground">
            <MessageSquareWarning className="size-4 text-destructive" strokeWidth={2} /> 1–3 stars ·
            Private recovery
          </p>
          <div className="mt-3 rounded-xl bg-secondary/40 px-4 py-5 text-center">
            <p className="font-serif text-[18px] text-foreground">We'd like to put this right.</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
              Tell us what went wrong — this goes straight to the general manager, never public.
            </p>
            <span className="mt-3 inline-flex h-10 items-center rounded-xl border border-input bg-card px-4 text-[12.5px] font-semibold text-foreground">
              Share private feedback
            </span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-muted-foreground">
        No incentive is ever sent to a guest who left negative feedback.
      </p>
    </Panel>
  );
}
