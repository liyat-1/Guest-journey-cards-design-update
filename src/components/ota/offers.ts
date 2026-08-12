/**
 * The offer catalogue.
 *
 * OTA Buster is a guest relationship journey, not a promotional campaign, so
 * every incentive carries two voices:
 *
 *  - `rationale` / `evidence`  — hotel-side. Why Directful recommends it.
 *  - `guest`                   — guest-side. Hospitality language only.
 *
 * The business reason is never shown to the guest, and the guest copy is never
 * used to justify the recommendation to the hotelier.
 */
import {
  BedDouble,
  Car,
  Clock,
  Croissant,
  Dumbbell,
  Gift,
  Hourglass,
  Package,
  Percent,
  Sparkles,
  SquareParking,
  Ticket,
  UtensilsCrossed,
  Waves,
  Wallet,
  Wine,
  type LucideIcon,
} from "lucide-react";

/** What the hotelier is trying to do for the guest — asked before any incentive. */
export type OfferGoalId = "enhance" | "arrival" | "experience" | "reward" | "return";

export const offerGoals: {
  id: OfferGoalId;
  label: string;
  detail: string;
  icon: LucideIcon;
}[] = [
  {
    id: "enhance",
    label: "Enhance the stay",
    detail: "Make the room or the mornings a little better.",
    icon: BedDouble,
  },
  {
    id: "arrival",
    label: "Make arrival easier",
    detail: "Remove friction around getting here and settling in.",
    icon: Clock,
  },
  {
    id: "experience",
    label: "Add an experience",
    detail: "Dining, spa or something memorable on property.",
    icon: Sparkles,
  },
  {
    id: "reward",
    label: "Reward the guest",
    detail: "Give something back with no strings attached.",
    icon: Gift,
  },
  {
    id: "return",
    label: "Encourage a return visit",
    detail: "Earn the next booking directly — only once the stay went well.",
    icon: Ticket,
  },
];

export const goalLabel = (id: OfferGoalId) =>
  offerGoals.find((g) => g.id === id)?.label ?? "Enhance the stay";

/** The visual archetype used to preview the offer to the guest. */
export type OfferArt = "room" | "menu" | "wellness" | "value" | "clock" | "route" | "gift";

/** Colour family. Keeps a spa credit from ever looking like a discount. */
export type OfferTone = "sky" | "teal" | "moss" | "amber" | "clay" | "plum";

export type OfferDef = {
  id: string;
  name: string;
  /** Category label shown to the guest, e.g. "Room upgrade". */
  type: string;
  goal: OfferGoalId;
  art: OfferArt;
  tone: OfferTone;
  icon: LucideIcon;
  /** What it costs the hotel — internal only. */
  cost: string;
  /** The value line on the guest card, e.g. "Included" or "From $60 / night". */
  value: string;
  /** Guest-facing sentence. Hospitality voice, never analytics. */
  guest: string;
  /** Guest-facing supporting points. */
  benefits: string[];
  /** Hotel-side reason this offer exists in the catalogue. */
  rationale: string;
  /** Configurable amount type for discounts. */
  amount?: "percent" | "fixed";
};

export const offerCatalog: OfferDef[] = [
  {
    id: "upgrade",
    name: "Room upgrade",
    type: "Room upgrade",
    goal: "enhance",
    art: "room",
    tone: "sky",
    icon: BedDouble,
    cost: "$30 when available",
    value: "Subject to availability",
    guest: "Enjoy a little more space and comfort during your stay.",
    benefits: [
      "A higher room category when one is free",
      "Confirmed at check-in",
      "Nothing to pay now",
    ],
    rationale:
      "A status benefit rather than a discount. It protects the rate, costs nothing when inventory is soft, and performs best with returning and high-value guests.",
  },
  {
    id: "suite",
    name: "Suite for a night",
    type: "Suite upgrade",
    goal: "enhance",
    art: "room",
    tone: "plum",
    icon: BedDouble,
    cost: "$85 per stay",
    value: "One night in a suite",
    guest: "Spend one night of your stay in one of our suites.",
    benefits: ["Separate living area", "Bosphorus-facing where available", "Arranged before arrival"],
    rationale:
      "A high-perceived-value benefit for long stays. Low take-up, high satisfaction — best reserved for high-value guests.",
  },
  {
    id: "breakfast",
    name: "Breakfast included",
    type: "Breakfast",
    goal: "enhance",
    art: "menu",
    tone: "amber",
    icon: Croissant,
    cost: "$18 per stay",
    value: "Included",
    guest: "Start your stay with breakfast included.",
    benefits: ["Daily breakfast for two", "Served until 10:30", "No charge added to your stay"],
    rationale:
      "The clearest value signal in the journey and the easiest yes. Strong with couples and first-time guests, with margin intact.",
  },
  {
    id: "dining",
    name: "Dining credit",
    type: "Dining credit",
    goal: "experience",
    art: "menu",
    tone: "clay",
    icon: UtensilsCrossed,
    cost: "$25 credit",
    value: "$25 to spend",
    guest: "Enjoy dinner with us — the first $25 is on the house.",
    benefits: ["Usable across restaurant and bar", "No minimum spend", "Valid throughout your stay"],
    rationale:
      "Lifts F&B attach rate and satisfaction at the same time. Families and longer stays respond best; effective cost is well below face value.",
  },
  {
    id: "private-dining",
    name: "Private dining experience",
    type: "Experience",
    goal: "experience",
    art: "menu",
    tone: "plum",
    icon: Wine,
    cost: "$60 per stay",
    value: "For two guests",
    guest: "Make one evening special with a private table for two.",
    benefits: ["Chef's menu for two", "Terrace seating when the weather allows", "Reserved by our team"],
    rationale:
      "A memory-making offer rather than a conversion lever. Use in-stay with high-value guests — it is the strongest predictor of a later direct booking.",
  },
  {
    id: "spa",
    name: "Spa credit",
    type: "Spa credit",
    goal: "experience",
    art: "wellness",
    tone: "teal",
    icon: Waves,
    cost: "$25 credit",
    value: "$25 toward any treatment",
    guest: "Take some time to relax with a treatment at the spa.",
    benefits: ["Any treatment on the menu", "Book at reception", "Valid during your stay"],
    rationale:
      "In-stay generosity that reads as care, not marketing. Works with longer stays; avoid with business travellers where acceptance is under 4%.",
  },
  {
    id: "gym",
    name: "Wellness access",
    type: "Wellness",
    goal: "experience",
    art: "wellness",
    tone: "moss",
    icon: Dumbbell,
    cost: "$0 in-house",
    value: "Complimentary",
    guest: "Use the gym, pool and sauna throughout your stay.",
    benefits: ["Open 06:00 – 22:00", "Towels and water provided", "No booking needed"],
    rationale:
      "Zero marginal cost. Useful when the goal is engagement rather than revenue — particularly with business travellers.",
  },
  {
    id: "early",
    name: "Early check-in",
    type: "Early check-in",
    goal: "arrival",
    art: "clock",
    tone: "sky",
    icon: Clock,
    cost: "$0 subject to availability",
    value: "From 11:00",
    guest: "Arriving early? Start your stay a little sooner.",
    benefits: ["Room ready from 11:00 when available", "Confirmed the day before", "No charge"],
    rationale:
      "A zero-cost service benefit — the right incentive when you need a form completed rather than a sale.",
  },
  {
    id: "late",
    name: "Late checkout",
    type: "Late checkout",
    goal: "arrival",
    art: "clock",
    tone: "teal",
    icon: Hourglass,
    cost: "$0 subject to availability",
    value: "Until 14:00",
    guest: "Enjoy a little more time before you head home.",
    benefits: ["Room until 14:00 when occupancy allows", "Ask any time during your stay", "No charge"],
    rationale:
      "The most accepted benefit in the catalogue and free when occupancy allows. Business travellers value time over money.",
  },
  {
    id: "transfer",
    name: "Airport transfer",
    type: "Transfer",
    goal: "arrival",
    art: "route",
    tone: "sky",
    icon: Car,
    cost: "$45 per stay",
    value: "One-way, private",
    guest: "Make your arrival easier with a private transfer.",
    benefits: ["Met in the arrivals hall", "Private car to the hotel", "Flight tracked by our team"],
    rationale:
      "Service beats discount with international and high-value guests — transfers convert at roughly double any percentage offer pre-arrival.",
  },
  {
    id: "parking",
    name: "Parking included",
    type: "Parking",
    goal: "arrival",
    art: "route",
    tone: "moss",
    icon: SquareParking,
    cost: "$15 per night",
    value: "Included",
    guest: "Driving in? Parking is on us for your stay.",
    benefits: ["Secure on-site space", "In and out access", "No charge added"],
    rationale:
      "Removes a concrete worry for guests arriving by car. Low take-up overall, high acceptance where it applies.",
  },
  {
    id: "amenity",
    name: "Welcome amenity",
    type: "Welcome amenity",
    goal: "reward",
    art: "gift",
    tone: "amber",
    icon: Gift,
    cost: "$12 per stay",
    value: "Waiting in your room",
    guest: "Add something special to your arrival.",
    benefits: ["Chosen by our team", "In the room when you arrive", "No charge"],
    rationale:
      "Recognition, not discount. Returning guests who receive a welcome amenity at booking convert 2.4× more often later in the journey.",
  },
  {
    id: "credit",
    name: "Direct-booking credit",
    type: "Property credit",
    goal: "return",
    art: "value",
    tone: "moss",
    icon: Wallet,
    cost: "$40 per booking",
    value: "$40 credit",
    guest: "Book directly next time and enjoy $40 to spend with us.",
    benefits: ["Spend it on dining, spa or the bar", "No blackout dates", "Valid for 12 months"],
    rationale:
      "Keeps value inside the property instead of cutting the rate. Higher margin than a like-for-like discount.",
  },
  {
    id: "ten-off",
    name: "10% off next direct stay",
    type: "Direct-booking benefit",
    goal: "return",
    art: "value",
    tone: "sky",
    icon: Percent,
    cost: "~$25 per booking",
    value: "10% off",
    amount: "percent",
    guest: "Next time, book directly with us and enjoy 10% off your stay.",
    benefits: ["Off our best available rate", "All room types", "Valid for 6 months"],
    rationale:
      "The strongest performer once a stay has gone well — and only then. Sent early it discounts a decision the guest has already made.",
  },
  {
    id: "fixed",
    name: "$30 off next direct stay",
    type: "Direct-booking benefit",
    goal: "return",
    art: "value",
    tone: "teal",
    icon: Percent,
    cost: "$30 per booking",
    value: "$30 off",
    amount: "fixed",
    guest: "Next time, book directly with us and take $30 off your stay.",
    benefits: ["Clear, flat value", "Any length of stay", "Valid for 6 months"],
    rationale:
      "Easier to grasp than a percentage on short stays, and caps your exposure on high-rate nights.",
  },
  {
    id: "package",
    name: "Exclusive returning-guest rate",
    type: "Members rate",
    goal: "return",
    art: "value",
    tone: "plum",
    icon: Package,
    cost: "$55 per booking",
    value: "Direct guests only",
    guest: "As a returning guest, book direct for a rate we don't publish anywhere else.",
    benefits: ["Better than any OTA rate", "Breakfast included", "Flexible cancellation"],
    rationale:
      "Higher ADR with fewer takers. Frames the benefit as belonging rather than discounting — best with returning guests.",
  },
  {
    id: "custom",
    name: "Custom benefit",
    type: "Custom",
    goal: "reward",
    art: "gift",
    tone: "clay",
    icon: Sparkles,
    cost: "You decide",
    value: "Defined by you",
    guest: "A little something extra for your stay.",
    benefits: ["Set your own terms", "Shown exactly as you write it"],
    rationale: "Use when the property has something the catalogue does not cover.",
  },
];

export const offerById = (id: string): OfferDef | undefined => offerCatalog.find((o) => o.id === id);

export const offersForGoal = (goal: OfferGoalId) => offerCatalog.filter((o) => o.goal === goal);

/** Legacy incentive ids seeded in the journey model map onto the catalogue. */
const aliases: Record<string, string> = {
  "free breakfast": "breakfast",
  "10% off direct": "ten-off",
  "$30 off direct": "fixed",
  "spa credit": "spa",
  "dining credit": "dining",
  "room upgrade": "upgrade",
  "airport transfer": "transfer",
  "early check-in": "early",
  "late checkout": "late",
  "exclusive package": "package",
  "welcome amenity": "amenity",
};

/**
 * Resolves any stored offer (seeded, aliased or renamed by the hotelier) to a
 * catalogue entry so its preview and rationale always match its nature.
 */
export function resolveOffer(input: { id?: string; name?: string; type?: string }): OfferDef {
  const byId = input.id ? offerById(input.id) : undefined;
  if (byId) return byId;
  const key = (input.name ?? "").toLowerCase();
  const aliased = aliases[key];
  if (aliased) return offerById(aliased)!;
  if (/%|percent/.test(key)) return offerById("ten-off")!;
  if (/\$\d/.test(key)) return offerById("fixed")!;
  if (/breakfast/.test(key)) return offerById("breakfast")!;
  if (/upgrade|suite/.test(key)) return offerById("upgrade")!;
  if (/spa|massage/.test(key)) return offerById("spa")!;
  if (/gym|wellness|pool/.test(key)) return offerById("gym")!;
  if (/din|restaurant|bar/.test(key)) return offerById("dining")!;
  if (/transfer|taxi|car/.test(key)) return offerById("transfer")!;
  if (/park/.test(key)) return offerById("parking")!;
  if (/early/.test(key)) return offerById("early")!;
  if (/late/.test(key)) return offerById("late")!;
  if (/credit/.test(key)) return offerById("credit")!;
  if (/rate|package|member/.test(key)) return offerById("package")!;
  return offerById("custom")!;
}

/** Colour classes per tone, so each kind of offer reads as its own thing. */
export const toneClasses: Record<
  OfferTone,
  { text: string; soft: string; border: string; solid: string; art: string }
> = {
  sky: {
    text: "text-tone-sky",
    soft: "bg-tone-sky-soft",
    border: "border-tone-sky/25",
    solid: "bg-tone-sky text-primary-foreground",
    art: "from-tone-sky-soft to-card",
  },
  teal: {
    text: "text-tone-teal",
    soft: "bg-tone-teal-soft",
    border: "border-tone-teal/25",
    solid: "bg-tone-teal text-primary-foreground",
    art: "from-tone-teal-soft to-card",
  },
  moss: {
    text: "text-tone-moss",
    soft: "bg-tone-moss-soft",
    border: "border-tone-moss/25",
    solid: "bg-tone-moss text-primary-foreground",
    art: "from-tone-moss-soft to-card",
  },
  amber: {
    text: "text-tone-amber",
    soft: "bg-tone-amber-soft",
    border: "border-tone-amber/30",
    solid: "bg-tone-amber text-primary-foreground",
    art: "from-tone-amber-soft to-card",
  },
  clay: {
    text: "text-tone-clay",
    soft: "bg-tone-clay-soft",
    border: "border-tone-clay/25",
    solid: "bg-tone-clay text-primary-foreground",
    art: "from-tone-clay-soft to-card",
  },
  plum: {
    text: "text-tone-plum",
    soft: "bg-tone-plum-soft",
    border: "border-tone-plum/25",
    solid: "bg-tone-plum text-primary-foreground",
    art: "from-tone-plum-soft to-card",
  },
};

/**
 * Guest-facing framing per stage. The same benefit is introduced differently
 * depending on where the relationship is — never one generic promo tone.
 */
export const stageVoice: Record<
  string,
  { eyebrow: string; headline: string; cta: string; closing: string }
> = {
  "just-booked": {
    eyebrow: "Enhance your upcoming stay",
    headline: "Make your upcoming stay even better.",
    cta: "Add to my stay",
    closing: "Optional — your reservation is already confirmed.",
  },
  "pre-checkin": {
    eyebrow: "Ready for your arrival",
    headline: "Get everything ready for your arrival.",
    cta: "Add to my stay",
    closing: "Confirmed before you arrive.",
  },
  reminder: {
    eyebrow: "Still available",
    headline: "This is still held for you.",
    cta: "Keep it on my stay",
    closing: "Available until you arrive.",
  },
  "during-stay": {
    eyebrow: "While you're with us",
    headline: "Make the most of your stay.",
    cta: "Arrange it for me",
    closing: "Our team will take care of the details.",
  },
  "post-checkout": {
    eyebrow: "Thank you for staying with us",
    headline: "We'd love to welcome you back.",
    cta: "Book direct",
    closing: "Yours whenever you're ready to return.",
  },
  winback: {
    eyebrow: "Book direct next time",
    headline: "Enjoy a little something extra when you book direct.",
    cta: "Book direct",
    closing: "Valid on your next stay with us.",
  },
};

export const voiceFor = (stageId: string) => stageVoice[stageId] ?? stageVoice["just-booked"]!;

/**
 * The five questions every contextual offer has to answer, assembled for a
 * given stage and offer. Hotel-side language only.
 */
export type OfferRationale = {
  whyNow: string;
  whyThis: string;
  whyGuest: string;
  relationship: string;
  next: string;
};

const whyNowByStage: Record<string, string> = {
  "just-booked":
    "The guest has just booked and made their decision. An offer here is optional and only appropriate as an invitation to improve the stay.",
  "pre-checkin":
    "Arrival is close, so the guest is actively preparing. This is when an add-on reads as service rather than advertising.",
  reminder:
    "The purpose of this message is to finish an unfinished step. Keep an existing benefit visible, but introduce nothing new.",
  "during-stay":
    "The guest is on property. Anything offered now should respond to their current situation, like a concierge recommendation.",
  "post-checkout":
    "The stay is over and feedback comes first. A return offer only makes sense once the guest has told you the stay went well.",
  winback:
    "The relationship is established and the guest knows the property. This is the natural moment to ask for the next booking directly.",
};

const relationshipByStage: Record<string, string> = {
  "just-booked": "Establishes trust and shows the booking was noticed by a person, not a system.",
  "pre-checkin": "Positions the hotel as helpful before arrival, which lifts satisfaction later.",
  reminder: "Keeps the tone useful and low-pressure so the journey never feels like a funnel.",
  "during-stay": "Turns hospitality into a memory the guest associates with the property directly.",
  "post-checkout": "Rewards a good experience and converts goodwill into a public review.",
  winback: "Changes booking behaviour by making the direct channel the better relationship.",
};

const nextByStage: Record<string, string> = {
  "just-booked": "Complete the guest profile so the stay can be prepared.",
  "pre-checkin": "Finish pre-check-in and confirm the add-on.",
  reminder: "Complete the remaining pre-check-in step.",
  "during-stay": "Accept the benefit with the front desk or in the app.",
  "post-checkout": "Share the experience as a public review.",
  winback: "Book the next stay through the direct engine.",
};

export function offerRationale({
  stageId,
  offer,
  segmentLabel,
  evidence,
}: {
  stageId: string;
  offer: OfferDef;
  segmentLabel: string;
  evidence?: string;
}): OfferRationale {
  return {
    whyNow: whyNowByStage[stageId] ?? whyNowByStage["just-booked"]!,
    whyThis: offer.rationale,
    whyGuest: evidence
      ? `${segmentLabel} in this stage — ${evidence.toLowerCase()}.`
      : `${segmentLabel} in this stage. Recommendation is based on segment-level behaviour, never guest-by-guest.`,
    relationship: relationshipByStage[stageId] ?? relationshipByStage["just-booked"]!,
    next: nextByStage[stageId] ?? nextByStage["just-booked"]!,
  };
}