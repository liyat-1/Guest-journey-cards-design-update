import type { Stage } from "./journey";
import { opportunity, stageInsight } from "./analytics";

export type AttentionLevel = "action" | "opportunity" | "healthy";

export type Attention = {
  level: AttentionLevel;
  label: string;
  reason: string;
  cta: string;
};

/**
 * One clear priority per stage. Opportunity is only ever surfaced on the stage
 * where the business value is understandable — Winback.
 */
export function attentionFor(stage: Stage): Attention {
  if (stage.offers.length === 0 && stage.offerResults.length > 0) {
    return {
      level: "action",
      label: "Needs a decision",
      reason: `No offer attached. ${stage.offerResults[0]!.name} converted ${stage.offerResults[0]!.conversions} guests in this stage before.`,
      cta: "Choose an offer",
    };
  }

  if (stage.id === opportunity.stageId) {
    return {
      level: "opportunity",
      label: "Opportunity",
      reason: `${opportunity.guests.toLocaleString()} OTA guests are eligible for a direct-conversion incentive — ${opportunity.revenueOpportunity} in revenue opportunity.`,
      cta: "Review opportunity",
    };
  }

  return {
    level: "healthy",
    label: "On track",
    reason: stageInsight[stage.id] ?? "Sending normally.",
    cta: "Open stage",
  };
}

/** "Start here" stays short: every real decision, plus the single opportunity. */
export function priorityStages(stages: Stage[]) {
  const scored = stages
    .map((s) => ({ stage: s, attention: attentionFor(s) }))
    .filter((x) => x.attention.level !== "healthy");

  const actions = scored.filter((x) => x.attention.level === "action");
  const topOpportunity = scored.filter((x) => x.attention.level === "opportunity").slice(0, 1);

  return [...actions, ...topOpportunity];
}
