/**
 * OTA Buster — guest journey model.
 * Everything a hotelier needs for one stage lives on that stage:
 * message, landing, success, offer, smart rules, performance, opportunity.
 */

export const property = "Wyndham Grand Istanbul Levent";

export type Tone = "Warm" | "Helpful" | "Concise" | "Friendly" | "Grateful" | "Personal" | "Luxury";

export const tonePresets: Tone[] = [
  "Warm",
  "Helpful",
  "Concise",
  "Friendly",
  "Grateful",
  "Personal",
  "Luxury",
];

export type Channel = "Email" | "Text";

export type StageMessage = {
  channel: Channel;
  timing: string;
  tone: Tone;
  subject: string;
  preheader: string;
  body: string;
  cta: string;
  tokens: string[];
};

export type AudienceMode = "all" | "conditional";

export type AudienceCondition = {
  id: string;
  label: string;
  guests: number;
};

export type StageOffer = {
  id: string;
  name: string;
  type: string;
  cost: string;
  /** Which guest segment this offer is for. "all" = everyone in the stage. */
  segment: import("./segments").GuestSegmentId | "all";
  audienceMode: AudienceMode;
  conditions: string[];
  cap?: string | undefined;
};

export type IncentiveOption = {
  id: string;
  name: string;
  type: string;
  cost: string;
  note: string;
};

export type OfferResult = {
  id: string;
  name: string;
  conversions: number;
  revenue: string;
  rate: string;
};

export type Landing = {
  headline: string;
  sub: string;
  facts: { label: string; value: string }[];
  sectionTitle: string;
  fields?: string[];
  cards?: { title: string; detail: string; price: string }[];
  verified?: string[];
  cta: string;
};

export type Success = {
  headline: string;
  sub: string;
  checks: string[];
  footer?: string;
  cta?: string;
};

export type Metric = { label: string; value: string; hint?: string };

export type Opportunity = {
  title: string;
  guests: number;
  lines: string[];
  recommendation: string;
  offerId: string;
};

export type Editor = { name: string; initials: string; when: string };

export type Stage = {
  id: string;
  index: string;
  name: string;
  short: string;
  purpose: string;
  why: string;
  guests: number;
  headline: Metric[];
  message: StageMessage;
  landing: Landing;
  success: Success;
  offers: StageOffer[];
  incentiveOptions: IncentiveOption[];
  audienceConditions: AudienceCondition[];
  rules: string[];
  performance: Metric[];
  opportunity: Opportunity | null;
  offerResults: OfferResult[];
  editors: Editor[];
  branch?: boolean;
};

export const summary: Metric[] = [
  { label: "OTA guests", value: "2,481", hint: "In the journey right now" },
  { label: "Guests reached", value: "2,314", hint: "93.3% deliverability" },
  { label: "Direct conversions", value: "347", hint: "+38 vs previous period" },
  { label: "Direct revenue", value: "$28,420", hint: "$4,263 commission avoided" },
  { label: "Conversion rate", value: "14.0%", hint: "City-hotel benchmark 5.1%" },
];

export const periods = ["Last 7 days", "Last 30 days", "Last 90 days", "Year to date"];

const upgradeOptions: IncentiveOption[] = [
  {
    id: "upgrade",
    name: "Room upgrade",
    type: "Upgrade",
    cost: "$30 when available",
    note: "Best performer before arrival",
  },
  {
    id: "breakfast",
    name: "Free breakfast",
    type: "Amenity",
    cost: "$18 per stay",
    note: "High acceptance with couples",
  },
  {
    id: "early",
    name: "Early check-in",
    type: "Service",
    cost: "$0 subject to availability",
    note: "Popular with morning arrivals",
  },
  {
    id: "late",
    name: "Late checkout",
    type: "Service",
    cost: "$0 subject to availability",
    note: "Popular with weekend stays",
  },
  {
    id: "transfer",
    name: "Airport transfer",
    type: "Experience",
    cost: "$45 per stay",
    note: "Strong with international guests",
  },
  {
    id: "spa",
    name: "Spa credit",
    type: "Credit",
    cost: "$25 credit",
    note: "Works with longer stays",
  },
];

const winbackOptions: IncentiveOption[] = [
  {
    id: "ten-off",
    name: "10% off direct",
    type: "Discount",
    cost: "~$25 per booking",
    note: "Strongest performer",
  },
  {
    id: "fixed",
    name: "$30 off direct",
    type: "Fixed discount",
    cost: "$30 per booking",
    note: "Clear value for short stays",
  },
  {
    id: "breakfast",
    name: "Free breakfast",
    type: "Amenity",
    cost: "$18 per stay",
    note: "Good margin alternative",
  },
  {
    id: "upgrade",
    name: "Room upgrade",
    type: "Upgrade",
    cost: "$30 when available",
    note: "No cash discount",
  },
  {
    id: "package",
    name: "Exclusive package",
    type: "Package",
    cost: "$55 per booking",
    note: "Higher ADR, fewer takers",
  },
  {
    id: "custom",
    name: "Custom offer",
    type: "Custom",
    cost: "You decide",
    note: "Define your own benefit",
  },
];

export const journey: Stage[] = [
  {
    id: "just-booked",
    index: "01",
    name: "Just Booked",
    short: "Welcome the guest and open a direct relationship.",
    purpose: "Welcome the guest and establish a direct relationship.",
    why: "The guest just booked through an OTA. This is the first opportunity to build a relationship directly with them.",
    guests: 1284,
    headline: [
      { label: "OTA guests", value: "1,284" },
      { label: "Message sent", value: "1,240" },
      { label: "Engagement", value: "68%" },
    ],
    message: {
      channel: "Email",
      timing: "Immediately after the booking arrives",
      tone: "Warm",
      subject: "Your stay at {{hotel.name}} is confirmed",
      preheader: "Everything is set for {{arrival_date}}",
      body: "Thanks for booking with us, {{guest.first_name}}. Your {{room_type}} is confirmed for {{arrival_date}} and we can't wait to welcome you.\n\nTake a moment to add a few details so we can prepare your arrival.",
      cta: "Confirm your details",
      tokens: [
        "{{guest.first_name}}",
        "{{hotel.name}}",
        "{{arrival_date}}",
        "{{room_type}}",
        "{{booking_link}}",
      ],
    },
    landing: {
      headline: "You're all set, {{guest.first_name}}.",
      sub: "Your stay at {{hotel.name}} is confirmed.",
      facts: [
        { label: "Arrival", value: "June 24" },
        { label: "Departure", value: "June 27" },
        { label: "Guests", value: "2" },
        { label: "Room", value: "Deluxe King" },
      ],
      sectionTitle: "Let's get a few details ready.",
      fields: ["Full name", "Email", "Phone", "Reason for travel"],
      verified: ["Name verified", "Email verified", "Guest profile created"],
      cta: "Save my details",
    },
    success: {
      headline: "You're all set, {{guest.first_name}}.",
      sub: "Your reservation at {{hotel.name}} is confirmed.",
      checks: ["Reservation confirmed", "Guest details saved", "Stay information ready"],
      footer: "We'll be in touch as your stay gets closer.",
      cta: "Explore your stay",
    },
    offers: [],
    incentiveOptions: upgradeOptions,
    audienceConditions: [
      { id: "returning", label: "Returning guests only", guests: 214 },
      { id: "long-stay", label: "Stays of 3+ nights", guests: 486 },
      { id: "opened", label: "Guests who opened the welcome email", guests: 843 },
    ],
    rules: [
      "Guest has a confirmed OTA booking",
      "Guest has a reachable email address",
      "Guest has not already completed pre-check-in",
      "Guest has not opted out of communication",
    ],
    performance: [
      { label: "Guests", value: "1,284" },
      { label: "Messages sent", value: "1,240", hint: "44 missing contact details" },
      { label: "Delivered", value: "97.4%" },
      { label: "Engagement", value: "68%", hint: "Opened or tapped" },
      { label: "Profile capture", value: "61%", hint: "Google One Tap: 38% of captures" },
    ],
    opportunity: {
      title: "Guest opportunity",
      guests: 214,
      lines: [
        "214 returning guests are in this stage",
        "148 opened the welcome email",
        "36 already booked direct before",
      ],
      recommendation:
        "Attach a welcome amenity for returning guests only — they convert 2.4× more often later in the journey.",
      offerId: "breakfast",
    },
    offerResults: [],
    editors: [
      { name: "Sarah Nolan", initials: "SN", when: "2 hours ago" },
      { name: "Michael Adeyemi", initials: "MA", when: "yesterday" },
    ],
  },
  {
    id: "pre-checkin",
    index: "02",
    name: "Pre-Check-in",
    short: "Prepare the guest and enhance the stay.",
    purpose: "Make the guest prepared, excited and open to enhancing the stay.",
    why: "The stay is coming up. Guests are most receptive to upgrades and add-ons in this window.",
    guests: 1102,
    headline: [
      { label: "Guests", value: "1,102" },
      { label: "Completed", value: "78%" },
      { label: "Add-on revenue", value: "$6,140" },
    ],
    message: {
      channel: "Email",
      timing: "3 days before arrival",
      tone: "Helpful",
      subject: "Your stay is coming up, {{guest.first_name}}",
      preheader: "Let's get everything ready before you arrive",
      body: "Your stay is almost here. Let's get everything ready before you arrive on {{arrival_date}}.\n\nComplete your pre-check-in in under a minute — and see what you can add to your {{room_type}}.",
      cta: "Complete pre-check-in",
      tokens: [
        "{{guest.first_name}}",
        "{{arrival_date}}",
        "{{room_type}}",
        "{{offer}}",
        "{{booking_link}}",
      ],
    },
    landing: {
      headline: "Your stay is almost here.",
      sub: "A minute now means a smoother arrival, {{guest.first_name}}.",
      facts: [
        { label: "Arrival", value: "June 24" },
        { label: "Departure", value: "June 27" },
        { label: "Room", value: "Deluxe King" },
        { label: "Nights", value: "3" },
      ],
      sectionTitle: "Make your stay even better.",
      cards: [
        {
          title: "Upgrade to Bosphorus Suite",
          detail: "More space, city and water views",
          price: "$60 / night",
        },
        { title: "Add breakfast", detail: "Daily breakfast for two", price: "$18 / day" },
        { title: "Early check-in", detail: "Arrive from 11:00", price: "Complimentary" },
      ],
      cta: "Confirm pre-check-in",
    },
    success: {
      headline: "You're ready for arrival.",
      sub: "Everything is confirmed for June 24.",
      checks: ["Pre-check-in complete", "Preferences saved", "Add-ons confirmed"],
      footer: "We can't wait to welcome you.",
    },
    offers: [
      {
        id: "upgrade",
        name: "Room upgrade",
        type: "Upgrade",
        cost: "$30 when available",
        audienceMode: "conditional",
        conditions: ["returning", "long-stay"],
        cap: "Max 40 upgrades per week",
        segment: "returning",
      },
    ],
    incentiveOptions: upgradeOptions,
    audienceConditions: [
      { id: "returning", label: "Returning guests only", guests: 186 },
      { id: "long-stay", label: "Stays of 3+ nights", guests: 402 },
      { id: "completed", label: "Completed pre-check-in", guests: 859 },
      { id: "clicked", label: "Clicked the pre-check-in link", guests: 624 },
      { id: "suite-eligible", label: "Room category is upgradable", guests: 512 },
    ],
    rules: [
      "Arrival is within 3 days",
      "Guest has not completed pre-check-in",
      "Guest has not already redeemed this offer",
      "Upgrade inventory is available for the stay dates",
    ],
    performance: [
      { label: "Guests", value: "1,102" },
      { label: "Completed", value: "859" },
      { label: "Completion rate", value: "78%" },
      { label: "Upgrades sold", value: "96" },
      { label: "Add-on revenue", value: "$6,140" },
    ],
    opportunity: {
      title: "Guest opportunity",
      guests: 243,
      lines: [
        "243 guests arriving in 3 days have not completed pre-check-in",
        "168 opened the message but did not finish",
        "112 are eligible for an upgrade",
      ],
      recommendation:
        "Send the upgrade offer to the 112 upgrade-eligible guests who clicked but didn't complete.",
      offerId: "upgrade",
    },
    offerResults: [
      { id: "upgrade", name: "Room upgrade", conversions: 96, revenue: "$4,120", rate: "11.2%" },
      { id: "breakfast", name: "Free breakfast", conversions: 74, revenue: "$1,330", rate: "8.6%" },
      { id: "early", name: "Early check-in", conversions: 41, revenue: "$690", rate: "4.8%" },
    ],
    editors: [{ name: "Sarah Nolan", initials: "SN", when: "yesterday" }],
  },
  {
    id: "reminder",
    index: "03",
    name: "Reminder",
    short: "A short nudge for guests who haven't finished.",
    purpose: "Get pre-check-in completed without sounding repetitive.",
    why: "Only guests with an unfinished step receive this. Everyone else skips it automatically.",
    guests: 243,
    headline: [
      { label: "Guests", value: "243" },
      { label: "Completed after reminder", value: "41%" },
      { label: "Channel", value: "Text" },
    ],
    message: {
      channel: "Text",
      timing: "1 day before arrival",
      tone: "Concise",
      subject: "",
      preheader: "",
      body: "Hi {{guest.first_name}}, your stay at {{hotel.name}} starts tomorrow. One step left — complete your pre-check-in: {{booking_link}}",
      cta: "Complete pre-check-in",
      tokens: ["{{guest.first_name}}", "{{hotel.name}}", "{{booking_link}}"],
    },
    landing: {
      headline: "Your stay is coming up.",
      sub: "Complete your pre-check-in before arrival.",
      facts: [
        { label: "Arrival", value: "Tomorrow, 15:00" },
        { label: "Room", value: "Deluxe King" },
      ],
      sectionTitle: "1 step remaining",
      fields: ["Confirm arrival time"],
      cta: "Complete pre-check-in",
    },
    success: {
      headline: "Done — see you tomorrow.",
      sub: "Your pre-check-in is complete.",
      checks: ["Pre-check-in complete", "Arrival time saved"],
      footer: "Your room upgrade is still available until arrival.",
    },
    offers: [],
    incentiveOptions: upgradeOptions,
    audienceConditions: [
      { id: "not-completed", label: "Pre-check-in not completed", guests: 243 },
      { id: "clicked", label: "Clicked but didn't finish", guests: 168 },
      { id: "returning", label: "Returning guests only", guests: 38 },
    ],
    rules: [
      "Pre-check-in is still incomplete",
      "Guest has not checked in yet",
      "Guest received fewer than 2 messages in the past 48 hours",
      "Guest has a verified mobile number",
    ],
    performance: [
      { label: "Guests", value: "243" },
      { label: "Delivered", value: "236" },
      { label: "Completed after reminder", value: "41%" },
      { label: "Skipped automatically", value: "859", hint: "Already completed" },
    ],
    opportunity: null,
    offerResults: [],
    editors: [{ name: "Michael Adeyemi", initials: "MA", when: "3 days ago" }],
  },
  {
    id: "during-stay",
    index: "04",
    name: "During Stay",
    short: "Be available while the guest is in-house.",
    purpose: "Make the guest feel cared for while they are with you.",
    why: "Service moments during the stay drive both satisfaction and later direct bookings.",
    guests: 486,
    headline: [
      { label: "Guests in-house", value: "486" },
      { label: "Interactions", value: "312" },
      { label: "Requests handled", value: "148" },
    ],
    message: {
      channel: "Text",
      timing: "Morning after check-in",
      tone: "Friendly",
      subject: "",
      preheader: "",
      body: "Good morning {{guest.first_name}} — how's everything in {{room_type}}? Anything you need is one message away: {{booking_link}}",
      cta: "Ask the hotel",
      tokens: ["{{guest.first_name}}", "{{room_type}}", "{{hotel.name}}", "{{booking_link}}"],
    },
    landing: {
      headline: "How is everything going?",
      sub: "We're here for anything you need during your stay.",
      facts: [
        { label: "Room", value: "Deluxe King 1204" },
        { label: "Checkout", value: "June 27, 12:00" },
      ],
      sectionTitle: "What can we help with?",
      cards: [
        { title: "Request assistance", detail: "Housekeeping, maintenance, extras", price: "" },
        { title: "Dining", detail: "Reserve a table or order in", price: "" },
        { title: "Spa & activities", detail: "Book a treatment or experience", price: "" },
      ],
      cta: "Message the hotel",
    },
    success: {
      headline: "We're on it.",
      sub: "Your request has reached the team.",
      checks: ["Request received", "Assigned to the front desk"],
      footer: "Enjoy the rest of your stay.",
    },
    offers: [
      {
        id: "late",
        name: "Late checkout",
        type: "Service",
        cost: "$0 subject to availability",
        audienceMode: "conditional",
        conditions: ["engaged"],
        cap: "Max 15 per day",
        segment: "business",
      },
    ],
    incentiveOptions: [
      ...upgradeOptions.filter((o) => o.id !== "early"),
      {
        id: "dining",
        name: "Dining credit",
        type: "Credit",
        cost: "$20 credit",
        note: "Lifts F&B attach rate",
      },
    ],
    audienceConditions: [
      { id: "engaged", label: "Guests who replied or tapped", guests: 312 },
      { id: "returning", label: "Returning guests only", guests: 84 },
      { id: "long-stay", label: "Stays of 3+ nights", guests: 196 },
    ],
    rules: [
      "Guest is currently in-house",
      "Guest has not opted out of messaging",
      "No more than one service message per day",
      "Open service request is not already in progress",
    ],
    performance: [
      { label: "Guests reached", value: "462" },
      { label: "Interactions", value: "312" },
      { label: "Requests", value: "148" },
      { label: "Engagement", value: "64%" },
    ],
    opportunity: null,
    offerResults: [
      { id: "late", name: "Late checkout", conversions: 63, revenue: "$0", rate: "13.6%" },
      { id: "dining", name: "Dining credit", conversions: 38, revenue: "$1,860", rate: "8.2%" },
    ],
    editors: [{ name: "Ayşe Kaya", initials: "AK", when: "5 days ago" }],
  },
  {
    id: "post-checkout",
    index: "05",
    name: "Post-Checkout",
    short: "Collect feedback, then branch on how the stay went.",
    purpose: "Understand the stay, earn the review, and open the door to a direct booking.",
    why: "Feedback decides what the guest hears next. Happy guests move toward winback; unhappy guests move into recovery.",
    guests: 846,
    branch: true,
    headline: [
      { label: "Guests", value: "846" },
      { label: "Feedback rate", value: "42%" },
      { label: "Positive", value: "196" },
    ],
    message: {
      channel: "Email",
      timing: "1 day after checkout",
      tone: "Grateful",
      subject: "How was your stay, {{guest.first_name}}?",
      preheader: "We'd love to hear how everything went",
      body: "We hope you enjoyed your stay at {{hotel.name}}, {{guest.first_name}}.\n\nWe'd love to hear how everything went — it takes less than a minute and it goes straight to our team.",
      cta: "Share your feedback",
      tokens: [
        "{{guest.first_name}}",
        "{{hotel.name}}",
        "{{room_type}}",
        "{{stay_dates}}",
        "{{booking_link}}",
      ],
    },
    landing: {
      headline: "How was your stay?",
      sub: "Your feedback goes straight to our team, {{guest.first_name}}.",
      facts: [
        { label: "Stay", value: "June 24–27" },
        { label: "Room", value: "Deluxe King" },
      ],
      sectionTitle: "Rate your stay",
      fields: ["Rating", "Anything you'd like us to know"],
      cta: "Send feedback",
    },
    success: {
      headline: "Thank you for your feedback.",
      sub: "We're glad you enjoyed your stay.",
      checks: ["Feedback received", "Shared with the hotel team"],
      footer: "Would you like to share your experience publicly?",
      cta: "Leave a review",
    },
    offers: [
      {
        id: "ten-off",
        name: "10% off direct",
        type: "Discount",
        cost: "~$25 per booking",
        audienceMode: "conditional",
        conditions: ["positive", "not-direct"],
        cap: "One offer per guest per 90 days",
        segment: "first-time",
      },
    ],
    incentiveOptions: winbackOptions,
    audienceConditions: [
      { id: "positive", label: "Gave 4–5 star feedback", guests: 196 },
      { id: "not-direct", label: "Has no direct booking yet", guests: 142 },
      { id: "returning", label: "Returning guests only", guests: 58 },
      { id: "review", label: "Left a public review", guests: 88 },
    ],
    rules: [
      "Guest has checked out",
      "Guest gave positive feedback",
      "Guest has not already booked direct",
      "Guest has not received this offer in the past 90 days",
    ],
    performance: [
      { label: "Guests", value: "846" },
      { label: "Feedback submitted", value: "355", hint: "42% feedback rate" },
      { label: "Positive (4–5★)", value: "196" },
      { label: "Negative (1–3★)", value: "42", hint: "18 in recovery" },
      { label: "Review clicks", value: "88" },
    ],
    opportunity: {
      title: "Guest opportunity",
      guests: 142,
      lines: [
        "284 guests are ready for the next step",
        "196 gave positive feedback",
        "142 are eligible for a direct-booking offer",
        "48 have already converted",
      ],
      recommendation:
        "Send 10% off to the 142 eligible guests. This offer generated the most direct bookings among comparable OTA guests.",
      offerId: "ten-off",
    },
    offerResults: [
      { id: "ten-off", name: "10% off direct", conversions: 48, revenue: "$8,420", rate: "12.8%" },
      { id: "breakfast", name: "Free breakfast", conversions: 34, revenue: "$5,240", rate: "9.4%" },
      { id: "upgrade", name: "Room upgrade", conversions: 21, revenue: "$2,180", rate: "6.1%" },
    ],
    editors: [
      { name: "Sarah Nolan", initials: "SN", when: "4 hours ago" },
      { name: "Ayşe Kaya", initials: "AK", when: "2 days ago" },
    ],
  },
  {
    id: "winback",
    index: "06",
    name: "Winback",
    short: "Bring OTA guests back — directly.",
    purpose: "Give the guest a reason to return through your own channel.",
    why: "These guests already know the property. A relevant benefit is usually enough to skip the OTA next time.",
    guests: 620,
    headline: [
      { label: "Eligible guests", value: "620" },
      { label: "Converted", value: "82" },
      { label: "Direct revenue", value: "$8,420" },
    ],
    message: {
      channel: "Email",
      timing: "21 days after checkout",
      tone: "Personal",
      subject: "Come back to {{hotel.name}} — {{offer}} when you book direct",
      preheader: "Your benefit is waiting whenever you're ready",
      body: "We'd love to welcome you back, {{guest.first_name}}. Since your stay in {{stay_dates}}, we've been keeping something for you.\n\nBook directly with us and enjoy {{offer}} on your next stay.",
      cta: "Book direct",
      tokens: [
        "{{guest.first_name}}",
        "{{hotel.name}}",
        "{{stay_dates}}",
        "{{offer}}",
        "{{booking_link}}",
      ],
    },
    landing: {
      headline: "Welcome back, {{guest.first_name}}.",
      sub: "Your benefit is ready when you book directly.",
      facts: [
        { label: "Your benefit", value: "10% off" },
        { label: "Valid until", value: "Sep 30" },
        { label: "Last stay", value: "June 24–27" },
      ],
      sectionTitle: "Choose your next stay",
      cards: [
        { title: "Deluxe King", detail: "Your previous room", price: "from $180 / night" },
        { title: "Bosphorus Suite", detail: "City and water views", price: "from $240 / night" },
      ],
      cta: "Continue to booking",
    },
    success: {
      headline: "Welcome back.",
      sub: "Your direct booking is confirmed.",
      checks: ["Direct booking confirmed", "Benefit applied", "Guest profile updated"],
      footer: "We look forward to seeing you again.",
    },
    offers: [
      {
        id: "ten-off",
        name: "10% off direct",
        type: "Discount",
        cost: "~$25 per booking",
        audienceMode: "conditional",
        conditions: ["not-converted", "positive"],
        cap: "One offer per guest per 90 days",
        segment: "first-time",
      },
    ],
    incentiveOptions: winbackOptions,
    audienceConditions: [
      { id: "not-converted", label: "Has not converted yet", guests: 538 },
      { id: "positive", label: "Gave 4–5 star feedback", guests: 196 },
      { id: "clicked", label: "Clicked but didn't book", guests: 48 },
      { id: "returning", label: "Stayed 2+ times", guests: 124 },
      { id: "high-value", label: "Stay value above $500", guests: 162 },
    ],
    rules: [
      "Guest has checked out and is not in-house",
      "Guest has not already booked direct",
      "Feedback is positive or neutral",
      "Guest has no unresolved complaint",
      "Guest has not received this offer in the past 90 days",
    ],
    performance: [
      { label: "Eligible guests", value: "620" },
      { label: "Messages sent", value: "584" },
      { label: "Clicks", value: "196" },
      { label: "Direct bookings", value: "82" },
      { label: "Conversion", value: "13.2%" },
      { label: "Direct revenue", value: "$8,420" },
    ],
    opportunity: {
      title: "Guest opportunity",
      guests: 538,
      lines: [
        "620 OTA guests are eligible",
        "196 engaged with previous messages",
        "48 clicked but didn't book",
        "82 already converted",
      ],
      recommendation:
        "Send 10% off to eligible guests who haven't converted. 184 guests are excluded automatically.",
      offerId: "ten-off",
    },
    offerResults: [
      { id: "ten-off", name: "10% off direct", conversions: 48, revenue: "$8,420", rate: "13.2%" },
      {
        id: "breakfast",
        name: "Free breakfast",
        conversions: 34,
        revenue: "$5,120",
        rate: "10.4%",
      },
      { id: "upgrade", name: "Room upgrade", conversions: 21, revenue: "$3,260", rate: "7.2%" },
    ],
    editors: [{ name: "Michael Adeyemi", initials: "MA", when: "6 hours ago" }],
  },
];

export const excludedReasons = [
  { label: "Already booked direct", guests: 82 },
  { label: "Unresolved negative feedback", guests: 18 },
  { label: "Currently in-house", guests: 36 },
  { label: "Received this offer recently", guests: 34 },
  { label: "Opted out of communication", guests: 14 },
];

export const journeyPerformance = {
  stages: journey.map((s) => ({
    id: s.id,
    name: s.name,
    guests: s.guests,
    reached: Math.round(s.guests * 0.93),
    engaged: Math.round(s.guests * 0.58),
  })),
  segments: [
    { label: "Returning guests", guests: 412, conversion: "21.4%", revenue: "$9,120" },
    { label: "First-time OTA guests", guests: 1684, conversion: "11.2%", revenue: "$14,260" },
    { label: "Long stays (3+ nights)", guests: 604, conversion: "18.6%", revenue: "$8,940" },
    { label: "Corporate travellers", guests: 286, conversion: "9.4%", revenue: "$3,180" },
  ],
  offers: [
    { label: "10% off direct", conversions: 96, revenue: "$16,840", rate: "13.0%" },
    { label: "Free breakfast", conversions: 68, revenue: "$10,360", rate: "9.8%" },
    { label: "Room upgrade", conversions: 42, revenue: "$5,440", rate: "6.6%" },
    { label: "Late checkout", conversions: 63, revenue: "$0", rate: "13.6%" },
  ],
  channels: [
    { label: "Email", sent: 4820, engaged: "46%", conversion: "12.4%" },
    { label: "Text", sent: 1240, engaged: "62%", conversion: "9.1%" },
  ],
  otas: [
    { label: "Booking.com", guests: 1462, conversion: "14.8%" },
    { label: "Expedia", guests: 622, conversion: "12.1%" },
    { label: "Agoda", guests: 397, conversion: "10.6%" },
  ],
};

/** The offer shown by default in previews: the all-guest offer, else the first. */
export function primaryOffer(stage: Stage): StageOffer | null {
  return stage.offers.find((o) => o.segment === "all") ?? stage.offers[0] ?? null;
}
