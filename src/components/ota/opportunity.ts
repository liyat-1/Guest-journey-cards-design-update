/**
 * One opportunity per stage. Aggregate only — never guest-by-guest.
 * Rendered by OpportunityCard on the journey and in Performance.
 */

import type { GuestSegmentId } from "./segments";

export type StageOpportunity = {
  stageId: string;
  stageName: string;
  segmentId: GuestSegmentId;
  headline: string;
  method: string;
  lines: string[];
  recommendation: string;
  /** Incentive id to preselect when the hotelier accepts the recommendation. */
  offerId: string;
  revenueOpportunity: string;
  guests: number;
};

export const stageOpportunities: StageOpportunity[] = [
  {
    stageId: "just-booked",
    stageName: "Just Booked",
    segmentId: "returning",
    headline: "214 returning guests are high-potential right now",
    method: "Aggregated at segment level — no guest-by-guest processing.",
    lines: [
      "214 returning guests are in this stage",
      "148 opened the welcome email",
      "36 already booked direct before",
    ],
    recommendation:
      "Attach a welcome amenity for returning guests only — they convert 2.4× more often later in the journey.",
    offerId: "breakfast",
    revenueOpportunity: "$5,240",
    guests: 214,
  },
  {
    stageId: "pre-checkin",
    stageName: "Pre-Check-in",
    segmentId: "high-value",
    headline: "112 upgrade-eligible guests clicked but never finished",
    method: "Counted from click events on the pre-check-in link, matched to upgradable rooms.",
    lines: [
      "243 guests arrive within 3 days and have not completed pre-check-in",
      "168 opened the message but stopped",
      "112 are in an upgradable room category",
    ],
    recommendation:
      "Send the room upgrade to the 112 upgrade-eligible guests who clicked but didn't complete.",
    offerId: "upgrade",
    revenueOpportunity: "$6,140",
    guests: 112,
  },
  {
    stageId: "reminder",
    stageName: "Reminder",
    segmentId: "first-time",
    headline: "2,140 guests never opened the pre-check-in email",
    method: "Guests with zero email opens in this stage who hold a verified mobile number.",
    lines: [
      "2,140 guests received the email but never opened it",
      "1,684 have a verified mobile number",
      "Text opens at 88.4% against 59.3% for email",
    ],
    recommendation:
      "Switch this group to text. Comparable properties recovered 9% more completions doing exactly this.",
    offerId: "early",
    revenueOpportunity: "$3,180",
    guests: 1684,
  },
  {
    stageId: "during-stay",
    stageName: "During Stay",
    segmentId: "business",
    headline: "132 business travellers are in-house and unengaged",
    method: "In-house guests in the business segment with no interaction in the last 24 hours.",
    lines: [
      "486 guests are in-house right now",
      "132 are business travellers with no interaction",
      "Late checkout is accepted by 13.6% of this segment",
    ],
    recommendation:
      "Offer late checkout to business travellers only. It costs nothing when occupancy allows and lifts direct intent.",
    offerId: "late",
    revenueOpportunity: "$2,460",
    guests: 132,
  },
  {
    stageId: "post-checkout",
    stageName: "Post-Checkout",
    segmentId: "returning",
    headline: "196 guests rated 4–5★ and have no direct booking",
    method:
      "Guests who submitted 4–5★ feedback in the selected period and have never booked through the direct engine.",
    lines: [
      "355 guests submitted feedback",
      "196 rated the stay 4–5★",
      "142 have never booked direct",
      "88 already left a public review",
    ],
    recommendation:
      "Ask the 88 reviewers for the direct booking now, and send the review request to the remaining 108 first.",
    offerId: "ten-off",
    revenueOpportunity: "$18,620",
    guests: 196,
  },
  {
    stageId: "winback",
    stageName: "Winback",
    segmentId: "high-value",
    headline: "1,248 OTA guests are eligible for a direct-conversion incentive",
    method:
      "Guests who completed a stay in the period, never booked direct, hold marketing consent, have no unresolved complaint and received no incentive in 90 days.",
    lines: [
      "1,248 guests are eligible",
      "962 have been reached",
      "162 are high-value guests",
      "128 have already converted",
    ],
    recommendation:
      "Give high-value guests a room upgrade instead of a discount — same conversion, $27 more margin per booking.",
    offerId: "upgrade",
    revenueOpportunity: "$46,800",
    guests: 1248,
  },
];

export const stageOpportunity = (stageId: string) =>
  stageOpportunities.find((o) => o.stageId === stageId);
