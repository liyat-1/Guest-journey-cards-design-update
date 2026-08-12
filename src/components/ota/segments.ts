/**
 * Guest segmentation — the spine of offer recommendations.
 *
 * OTA Buster never recommends "an offer for this stage". It recommends an
 * offer for a *segment* at that stage: a returning guest at Just Booked needs
 * something completely different from a first-time guest at the same moment.
 */

export type GuestSegmentId = "first-time" | "returning" | "high-value" | "family" | "business";

export type GuestSegment = {
  id: GuestSegmentId;
  name: string;
  short: string;
  description: string;
  /** Tailwind token pairing used for the segment badge. */
  tint: string;
};

export const guestSegments: GuestSegment[] = [
  {
    id: "first-time",
    name: "First-time guest",
    short: "First-time",
    description: "Never stayed with the property before. No relationship yet.",
    tint: "border-primary/25 bg-primary-soft/60 text-primary",
  },
  {
    id: "returning",
    name: "Returning guest",
    short: "Returning",
    description: "Has stayed before, but always through an OTA.",
    tint: "border-gold/40 bg-gold-soft text-[oklch(0.5_0.11_82)]",
  },
  {
    id: "high-value",
    name: "High-value guest",
    short: "High value",
    description: "Above-average stay value, suite categories or long stays.",
    tint: "border-success/25 bg-success/10 text-success",
  },
  {
    id: "family",
    name: "Family",
    short: "Family",
    description: "Booked with children or two-plus adults sharing.",
    tint: "border-border bg-secondary text-muted-foreground",
  },
  {
    id: "business",
    name: "Business traveller",
    short: "Business",
    description: "Midweek, single occupancy, short stays.",
    tint: "border-border bg-secondary text-muted-foreground",
  },
];

export const segmentName = (id: GuestSegmentId | "all") =>
  id === "all" ? "All guests" : (guestSegments.find((s) => s.id === id)?.name ?? id);

export const segmentShort = (id: GuestSegmentId | "all") =>
  id === "all" ? "All guests" : (guestSegments.find((s) => s.id === id)?.short ?? id);

export const segmentTint = (id: GuestSegmentId | "all") =>
  id === "all"
    ? "border-border bg-secondary text-muted-foreground"
    : (guestSegments.find((s) => s.id === id)?.tint ??
      "border-border bg-secondary text-muted-foreground");

/** One recommendation per segment, per stage. */
export type SegmentPlay = {
  segmentId: GuestSegmentId;
  guests: number;
  /** What the hotel is trying to achieve with this segment, here. */
  goal: string;
  /** The recommended incentive id — matches the stage's incentive options. */
  offerId: string;
  offerName: string;
  predicted: string;
  /** Why this offer, for this segment, at this stage. */
  reason: string;
  /** What NOT to do — keeps the recommendation honest. */
  avoid: string;
};

export const stageSegmentPlays: Record<string, SegmentPlay[]> = {
  "just-booked": [
    {
      segmentId: "returning",
      guests: 214,
      goal: "Recognise them before anyone else does.",
      offerId: "breakfast",
      offerName: "Free breakfast",
      predicted: "12.4% predicted profile capture lift",
      reason:
        "Returning guests who receive a welcome amenity at booking convert 2.4× more often in Winback. Recognition beats discount depth this early.",
      avoid: "Never discount here — they already paid the OTA rate.",
    },
    {
      segmentId: "first-time",
      guests: 843,
      goal: "Capture the profile, not the booking.",
      offerId: "early",
      offerName: "Early check-in",
      predicted: "0 cost · 38% form completion",
      reason:
        "A zero-cost service benefit is enough to get a first-time guest to hand over their details. The direct booking comes later in the journey.",
      avoid: "No cash incentive — it trains the guest to wait for one.",
    },
    {
      segmentId: "high-value",
      guests: 118,
      goal: "Open a personal line early.",
      offerId: "upgrade",
      offerName: "Room upgrade",
      predicted: "18.2% predicted engagement",
      reason:
        "High-value guests respond to status, not savings. An upgrade offered at booking protects ADR and starts the relationship on the right footing.",
      avoid: "Avoid percentage discounts — they lower the anchor for later.",
    },
  ],
  "pre-checkin": [
    {
      segmentId: "returning",
      guests: 186,
      goal: "Reward the repeat visit.",
      offerId: "upgrade",
      offerName: "Room upgrade",
      predicted: "16.8% predicted attach rate",
      reason:
        "Returning guests already know the rooms. An upgrade to a category they have not tried is the highest-converting pre-arrival offer for this segment.",
      avoid: "Don't re-sell breakfast if they took it on the last stay.",
    },
    {
      segmentId: "first-time",
      guests: 402,
      goal: "Make the first arrival effortless.",
      offerId: "breakfast",
      offerName: "Free breakfast",
      predicted: "9.4% predicted attach rate",
      reason:
        "First-time guests buy certainty, not luxury. Breakfast is the clearest value signal at this moment and keeps margin intact.",
      avoid: "Skip the suite upsell — conversion is under 2% for this segment.",
    },
    {
      segmentId: "high-value",
      guests: 96,
      goal: "Protect ADR while lifting the stay.",
      offerId: "transfer",
      offerName: "Airport transfer",
      predicted: "21.4% predicted attach rate",
      reason:
        "Service beats discount for this segment. Transfers convert at more than double the rate of any percentage-based offer here.",
      avoid: "Never cap the benefit — it reads as a downgrade.",
    },
  ],
  reminder: [
    {
      segmentId: "first-time",
      guests: 168,
      goal: "Remove the last bit of friction.",
      offerId: "early",
      offerName: "Early check-in",
      predicted: "41% completion after reminder",
      reason:
        "The blocker is effort, not value. A complimentary early check-in gives the guest a concrete reason to finish the form now.",
      avoid: "No incentives with a cash cost — this is a nudge, not a sale.",
    },
    {
      segmentId: "returning",
      guests: 38,
      goal: "Keep it short and familiar.",
      offerId: "late",
      offerName: "Late checkout",
      predicted: "48% completion after reminder",
      reason:
        "Returning guests complete without persuasion. A small service benefit is enough and costs nothing when occupancy allows.",
      avoid: "Don't repeat the pre-arrival offer — it reads as spam.",
    },
  ],
  "during-stay": [
    {
      segmentId: "high-value",
      guests: 84,
      goal: "Make the stay memorable enough to book direct next time.",
      offerId: "spa",
      offerName: "Spa credit",
      predicted: "14.2% predicted engagement",
      reason:
        "In-stay generosity for high-value guests is the strongest predictor of a direct booking within 90 days.",
      avoid: "Don't mention direct booking yet — earn it first.",
    },
    {
      segmentId: "business",
      guests: 132,
      goal: "Be useful, be brief.",
      offerId: "late",
      offerName: "Late checkout",
      predicted: "13.6% predicted engagement",
      reason:
        "Business travellers value time over money. Late checkout is the single most accepted benefit for this segment, at zero cost.",
      avoid: "Avoid dining and spa offers — acceptance is under 4%.",
    },
    {
      segmentId: "family",
      guests: 96,
      goal: "Solve the day, not the booking.",
      offerId: "dining",
      offerName: "Dining credit",
      predicted: "11.8% predicted engagement",
      reason:
        "Families convert on convenience. A dining credit lifts F&B attach rate and satisfaction scores at the same time.",
      avoid: "Don't send in the evening — engagement halves after 18:00.",
    },
  ],
  "post-checkout": [
    {
      segmentId: "returning",
      guests: 58,
      goal: "Turn a second OTA stay into a direct habit.",
      offerId: "upgrade",
      offerName: "Room upgrade",
      predicted: "19.8% predicted direct conversion",
      reason:
        "Returning guests who rated 4–5★ convert best on a status benefit, not a discount. It costs less and protects the rate.",
      avoid: "Don't stack a discount on top — it halves perceived value.",
    },
    {
      segmentId: "first-time",
      guests: 142,
      goal: "Give a first reason to come back directly.",
      offerId: "ten-off",
      offerName: "10% off direct",
      predicted: "12.8% predicted direct conversion",
      reason:
        "With no relationship yet, a clear monetary reason performs best for first-time guests after a positive stay.",
      avoid: "Never send to guests who rated 1–3★ — hand to recovery instead.",
    },
    {
      segmentId: "high-value",
      guests: 62,
      goal: "Convert the stay value, not the guest count.",
      offerId: "package",
      offerName: "Exclusive package",
      predicted: "17.4% predicted direct conversion",
      reason:
        "Higher ADR with fewer takers still outperforms a blanket discount for this segment by $38 revenue per guest.",
      avoid: "Avoid 10% off — it converts the same guests for less money.",
    },
  ],
  winback: [
    {
      segmentId: "returning",
      guests: 124,
      goal: "Make the direct channel the obvious choice.",
      offerId: "breakfast",
      offerName: "Free breakfast",
      predicted: "18.4% predicted direct conversion",
      reason:
        "Returning guests already trust the property. A margin-friendly amenity converts as well as 15% off and costs a third as much.",
      avoid: "Don't escalate the discount — they convert without it.",
    },
    {
      segmentId: "first-time",
      guests: 396,
      goal: "Give a strong, simple reason to return.",
      offerId: "ten-off",
      offerName: "10% off direct",
      predicted: "13.2% predicted direct conversion",
      reason:
        "First-time guests need a clear price signal to break the OTA habit. 10% is the lowest depth that still converts.",
      avoid: "Avoid packages — comprehension is low without a prior stay.",
    },
    {
      segmentId: "high-value",
      guests: 162,
      goal: "Win the booking without touching the rate.",
      offerId: "upgrade",
      offerName: "Room upgrade",
      predicted: "24.6% predicted direct conversion",
      reason:
        "The highest-converting combination tested. High-value guests respond to the upgrade at nearly twice the rate of any discount.",
      avoid: "Never send 20% off here — it costs $52 to win a $40 uplift.",
    },
  ],
};

/**
 * Exactly who enters a stage, stated in the guest's own terms. Shown at the
 * top of Conditions so the audience is never ambiguous.
 */
export const stageEntry: Record<string, { who: string; when: string; detail: string }> = {
  "just-booked": {
    who: "Guests who have just booked through an OTA",
    when: "The moment the reservation lands from Booking.com, Expedia or Agoda",
    detail: "The stay has not started. Nothing has been asked of the guest yet.",
  },
  "pre-checkin": {
    who: "Guests who are about to arrive",
    when: "Three days before the arrival date",
    detail: "The booking is confirmed and pre-check-in is still outstanding.",
  },
  reminder: {
    who: "Guests who started but did not finish pre-check-in",
    when: "One day before arrival",
    detail: "Anyone who already completed the step is skipped automatically.",
  },
  "during-stay": {
    who: "Guests who are currently in-house",
    when: "The morning after check-in",
    detail: "Only guests physically staying at the property right now.",
  },
  "post-checkout": {
    who: "Guests who are checking out",
    when: "One day after the checkout date",
    detail:
      "The stay is complete. This is the feedback and review moment — what the guest answers here decides what they hear next.",
  },
  winback: {
    who: "Past guests who have never booked direct",
    when: "Twenty-one days after checkout",
    detail: "Guests who already converted, or who left a complaint, never enter.",
  },
};

/**
 * Audience built from how the guest responded earlier in the journey.
 * This is what makes conditions feel like targeting rather than plumbing.
 */
export type ResponseCondition = {
  id: string;
  label: string;
  detail: string;
  guests: number;
};

export const stageResponseAudience: Record<string, ResponseCondition[]> = {
  "just-booked": [
    {
      id: "no-response",
      label: "Has not responded to anything yet",
      detail: "First contact — no prior signal exists.",
      guests: 8482,
    },
  ],
  "pre-checkin": [
    {
      id: "opened-welcome",
      label: "Opened the welcome email",
      detail: "Engaged at Just Booked.",
      guests: 5214,
    },
    {
      id: "completed-profile",
      label: "Completed the profile form",
      detail: "You already hold their first-party details.",
      guests: 3218,
    },
    {
      id: "ignored-welcome",
      label: "Ignored the welcome email",
      detail: "No open, no click at Just Booked.",
      guests: 3026,
    },
  ],
  reminder: [
    {
      id: "clicked-not-finished",
      label: "Clicked pre-check-in but did not finish",
      detail: "Highest-intent group in this stage.",
      guests: 1680,
    },
    {
      id: "never-opened",
      label: "Never opened the pre-check-in email",
      detail: "Switch to text for this group.",
      guests: 2140,
    },
  ],
  "during-stay": [
    {
      id: "replied",
      label: "Replied to a message during the stay",
      detail: "Actively engaged with the property.",
      guests: 3120,
    },
    {
      id: "requested",
      label: "Raised a service request",
      detail: "Resolve it before offering anything.",
      guests: 1480,
    },
    {
      id: "silent",
      label: "Has not interacted at all",
      detail: "A single, short message only.",
      guests: 1140,
    },
  ],
  "post-checkout": [
    {
      id: "positive",
      label: "Rated the stay 4–5★",
      detail: "Ready for a review request and a direct offer.",
      guests: 1960,
    },
    {
      id: "neutral",
      label: "Rated the stay 3★",
      detail: "Ask for private feedback, not a public review.",
      guests: 620,
    },
    {
      id: "negative",
      label: "Rated the stay 1–2★",
      detail: "Routed to recovery. Incentives are never sent.",
      guests: 420,
    },
    {
      id: "no-feedback",
      label: "Did not leave feedback",
      detail: "One short follow-up, then the stage closes.",
      guests: 840,
    },
  ],
  winback: [
    {
      id: "left-review",
      label: "Left a public review",
      detail: "Converts 2.1× better than the stage average.",
      guests: 880,
    },
    {
      id: "positive-no-review",
      label: "Rated 4–5★ but left no review",
      detail: "Lead with the offer, not the review ask.",
      guests: 1080,
    },
    {
      id: "clicked-no-booking",
      label: "Clicked a previous offer but did not book",
      detail: "Needs a different offer, not a louder one.",
      guests: 480,
    },
  ],
};
