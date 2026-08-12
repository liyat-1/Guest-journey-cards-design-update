/**
 * Configurable stage settings that were previously hard-coded:
 * timing, data-capture form fields and conditional logic.
 */

export type TimingAnchor =
  "after-booking" | "before-arrival" | "on-arrival" | "during-stay" | "after-stay" | "custom";

export const timingAnchors: { id: TimingAnchor; label: string }[] = [
  { id: "after-booking", label: "after booking" },
  { id: "before-arrival", label: "before arrival" },
  { id: "on-arrival", label: "on arrival day" },
  { id: "during-stay", label: "during the stay" },
  { id: "after-stay", label: "after checkout" },
  { id: "custom", label: "custom timing" },
];

export type TimingUnit = "minutes" | "hours" | "days";

export type Timing = {
  amount: number;
  unit: TimingUnit;
  anchor: TimingAnchor;
  note?: string;
};

export function timingLabel(t: Timing) {
  const anchor = timingAnchors.find((a) => a.id === t.anchor)?.label ?? "";
  if (t.anchor === "custom") return t.note || "Custom timing";
  if (t.amount === 0) return `Immediately ${anchor}`;
  return `${t.amount} ${t.unit} ${anchor}`;
}

export type FieldType = "text" | "email" | "phone" | "date" | "select" | "number" | "id";

export const fieldTypes: { id: FieldType; label: string }[] = [
  { id: "text", label: "Short text" },
  { id: "email", label: "Email address" },
  { id: "phone", label: "Phone number" },
  { id: "date", label: "Date" },
  { id: "number", label: "Number" },
  { id: "id", label: "ID / passport number" },
  { id: "select", label: "Choice list" },
];

export type FormField = {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
};

export type Condition = {
  id: string;
  label: string;
  detail: string;
  enabled: boolean;
};

export type StageConfig = {
  timing: Timing;
  formEnabled: boolean;
  formTitle: string;
  fields: FormField[];
  conditions: Condition[];
};

const baseConditions = (extra: Condition[] = []): Condition[] => [
  {
    id: "converted",
    label: "Guest converts to a direct booking",
    detail: "Stop the journey — no further messages are sent.",
    enabled: true,
  },
  {
    id: "already-direct",
    label: "Guest is already a direct guest",
    detail: "Exclude them from this stage entirely.",
    enabled: true,
  },
  {
    id: "negative",
    label: "Guest gives negative feedback",
    detail: "Never send an incentive — hand over to guest recovery instead.",
    enabled: true,
  },
  ...extra,
];

export const stageConfigs: Record<string, StageConfig> = {
  "just-booked": {
    timing: { amount: 0, unit: "minutes", anchor: "after-booking" },
    formEnabled: true,
    formTitle: "Let's get a few details ready",
    fields: [
      { id: "f1", label: "Full name", type: "text", required: true },
      { id: "f2", label: "Email address", type: "email", required: true },
      { id: "f3", label: "Phone number", type: "phone", required: false },
      { id: "f4", label: "ID / passport number", type: "id", required: false },
    ],
    conditions: baseConditions([
      {
        id: "checked-in",
        label: "Guest has already checked in",
        detail: "Skip the welcome message.",
        enabled: true,
      },
    ]),
  },
  "pre-checkin": {
    timing: { amount: 3, unit: "days", anchor: "before-arrival" },
    formEnabled: true,
    formTitle: "Complete your pre-check-in",
    fields: [
      { id: "f1", label: "Estimated arrival time", type: "text", required: false },
      { id: "f2", label: "Reason for travel", type: "select", required: false },
      { id: "f3", label: "ID / passport number", type: "id", required: true },
    ],
    conditions: baseConditions([
      {
        id: "completed",
        label: "Pre-check-in already complete",
        detail: "No follow-up is sent.",
        enabled: true,
      },
      {
        id: "high-value",
        label: "Guest is high value",
        detail: "Show the premium incentive instead of the default offer.",
        enabled: false,
      },
    ]),
  },
  reminder: {
    timing: { amount: 24, unit: "hours", anchor: "before-arrival" },
    formEnabled: false,
    formTitle: "Confirm your arrival",
    fields: [{ id: "f1", label: "Estimated arrival time", type: "text", required: false }],
    conditions: baseConditions(),
  },
  "during-stay": {
    timing: { amount: 1, unit: "days", anchor: "during-stay" },
    formEnabled: false,
    formTitle: "Tell us how it's going",
    fields: [{ id: "f1", label: "How is your stay?", type: "select", required: false }],
    conditions: baseConditions([
      {
        id: "in-house",
        label: "Guest has already checked out",
        detail: "Skip the in-stay message.",
        enabled: true,
      },
    ]),
  },
  "post-checkout": {
    timing: { amount: 1, unit: "days", anchor: "after-stay" },
    formEnabled: true,
    formTitle: "How was your stay?",
    fields: [
      { id: "f1", label: "Overall rating", type: "select", required: true },
      { id: "f2", label: "What stood out?", type: "text", required: false },
    ],
    conditions: baseConditions(),
  },
  winback: {
    timing: { amount: 14, unit: "days", anchor: "after-stay" },
    formEnabled: false,
    formTitle: "Book direct",
    fields: [],
    conditions: baseConditions([
      {
        id: "recent-offer",
        label: "Guest received an incentive in the last 90 days",
        detail: "Do not send another incentive.",
        enabled: true,
      },
      {
        id: "high-value",
        label: "Guest is high value",
        detail: "Show a complimentary upgrade instead of a percentage discount.",
        enabled: true,
      },
    ]),
  },
};

/* ------------------------------------------------------------------ */
/* Smart audience — who this stage applies to                          */
/* ------------------------------------------------------------------ */

export type Audience = {
  applies: { label: string; guests: number }[];
  excluded: { label: string; guests: number }[];
};

export const stageAudience: Record<string, Audience> = {
  "just-booked": {
    applies: [
      { label: "All new OTA bookings", guests: 8482 },
      { label: "Guests with a reachable email", guests: 8240 },
    ],
    excluded: [
      { label: "Already direct guests", guests: 1284 },
      { label: "No marketing consent", guests: 186 },
      { label: "Cancellations and no-shows", guests: 56 },
    ],
  },
  "pre-checkin": {
    applies: [
      { label: "Guests arriving in the next 7 days", guests: 6820 },
      { label: "Stays of 2+ nights", guests: 4218 },
    ],
    excluded: [
      { label: "Pre-check-in already complete", guests: 1204 },
      { label: "Already converted direct", guests: 214 },
      { label: "Received another incentive", guests: 168 },
    ],
  },
  reminder: {
    applies: [{ label: "Guests arriving tomorrow", guests: 5240 }],
    excluded: [
      { label: "Already checked in", guests: 486 },
      { label: "No mobile number on file", guests: 642 },
    ],
  },
  "during-stay": {
    applies: [{ label: "Guests currently in-house", guests: 4260 }],
    excluded: [
      { label: "Already checked out", guests: 312 },
      { label: "Unresolved complaint", guests: 24 },
    ],
  },
  "post-checkout": {
    applies: [{ label: "Guests who completed a stay", guests: 3960 }],
    excluded: [
      { label: "Guests who cancelled", guests: 84 },
      { label: "Opted out of communication", guests: 36 },
    ],
  },
  winback: {
    applies: [
      { label: "Repeat OTA guests", guests: 4218 },
      { label: "Leisure travellers", guests: 2860 },
      { label: "Guests staying 2+ nights", guests: 2140 },
    ],
    excluded: [
      { label: "Already direct guests", guests: 1284 },
      { label: "Guests who already converted", guests: 642 },
      { label: "Received another incentive", guests: 268 },
      { label: "Unresolved negative feedback", guests: 42 },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Offer types — editable in Settings                                  */
/* ------------------------------------------------------------------ */

export type OfferType = {
  id: string;
  name: string;
  discount: number;
  benefits: string[];
  description: string;
  eligibility: string;
  conditions: string;
  expiry: string;
  messaging: string;
  cost: string;
  usedIn: string[];
};

export const defaultOfferTypes: OfferType[] = [
  {
    id: "ten",
    name: "10% off direct",
    discount: 10,
    benefits: [],
    description: "A straightforward discount on the best available direct rate.",
    eligibility: "OTA guests who have not booked direct before",
    conditions: "One booking per guest. Not combinable with other offers.",
    expiry: "90 days from issue",
    messaging: "Book direct and save 10% on your next stay.",
    cost: "~$25 per booking",
    usedIn: ["Winback"],
  },
  {
    id: "fifteen",
    name: "15% off direct",
    discount: 15,
    benefits: [],
    description: "A deeper discount used for lapsed guests who need a stronger nudge.",
    eligibility: "Repeat OTA guests who have not converted in 12 months",
    conditions: "Minimum 2-night stay.",
    expiry: "60 days from issue",
    messaging: "We'd love to have you back — 15% off when you book direct.",
    cost: "~$38 per booking",
    usedIn: [],
  },
  {
    id: "twenty",
    name: "20% off direct",
    discount: 20,
    benefits: [],
    description: "Reserved for low-occupancy periods and high-value lapsed guests.",
    eligibility: "High-value guests, manual approval",
    conditions: "Midweek stays only. Subject to availability.",
    expiry: "45 days from issue",
    messaging: "An exclusive 20% off, just for you.",
    cost: "~$52 per booking",
    usedIn: [],
  },
  {
    id: "breakfast",
    name: "Free breakfast",
    discount: 0,
    benefits: ["Breakfast for two, daily"],
    description: "A margin-friendly amenity that outperforms small discounts with families.",
    eligibility: "All OTA guests",
    conditions: "Applies to two guests per room.",
    expiry: "120 days from issue",
    messaging: "Book direct and breakfast is on us.",
    cost: "$18 per stay",
    usedIn: ["Pre-Check-in"],
  },
  {
    id: "fifteen-breakfast",
    name: "15% off + free breakfast",
    discount: 15,
    benefits: ["Breakfast for two, daily"],
    description: "The strongest performing combination for repeat OTA guests.",
    eligibility: "Repeat OTA guests, leisure travellers, 2+ night stays",
    conditions: "Direct bookings only. One per guest per 90 days.",
    expiry: "90 days from issue",
    messaging: "Welcome back — 15% off plus complimentary breakfast when you book direct.",
    cost: "~$56 per booking",
    usedIn: ["Winback"],
  },
  {
    id: "upgrade",
    name: "Complimentary upgrade",
    discount: 0,
    benefits: ["One room category upgrade"],
    description: "Protects ADR while converting high-value guests at the highest rate tested.",
    eligibility: "High-value guests and frequent travellers",
    conditions: "Subject to availability at check-in.",
    expiry: "90 days from issue",
    messaging: "Book direct and we'll upgrade your room, on us.",
    cost: "$30 when available",
    usedIn: ["Pre-Check-in", "Winback"],
  },
  {
    id: "custom",
    name: "Custom incentive",
    discount: 0,
    benefits: [],
    description: "Build your own benefit for a specific campaign or property.",
    eligibility: "You decide",
    conditions: "You decide",
    expiry: "You decide",
    messaging: "",
    cost: "You decide",
    usedIn: [],
  },
];

/** Recommended offer per stage, with the reason the system recommends it. */
export const stageOfferRecommendation: Record<
  string,
  { offerId: string; name: string; predicted: string; reason: string } | null
> = {
  "just-booked": null,
  "pre-checkin": {
    offerId: "upgrade",
    name: "Complimentary upgrade",
    predicted: "14.8% predicted conversion rate",
    reason: "Best-performing offer for high-value guests in this stage.",
  },
  reminder: null,
  "during-stay": {
    offerId: "breakfast",
    name: "Free breakfast",
    predicted: "9.4% predicted conversion rate",
    reason: "Highest offer engagement for in-house guests without discounting the rate.",
  },
  "post-checkout": null,
  winback: {
    offerId: "fifteen-breakfast",
    name: "15% off + free breakfast",
    predicted: "14.8% predicted conversion rate",
    reason: "Best-performing offer for repeat OTA guests in this stage.",
  },
};
