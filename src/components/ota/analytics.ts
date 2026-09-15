/**
 * OTA Buster — aggregate intelligence layer.
 * Everything here is aggregate by design: OTA Buster runs across hundreds of
 * thousands of guests, so the product never surfaces individual guest records.
 */

export type Delta = { value: string; direction: "up" | "down" | "flat" };

export type Result = {
  id: string;
  label: string;
  value: string;
  context: string;
  delta?: Delta;
  method: string;
  emphasis?: boolean;
};

/** Primary business outcomes. Labels always explain what the number counts. */
export const results: Result[] = [
  {
    id: "ota-guests",
    label: "OTA guests",
    value: "12,482",
    context: "Bookings received from connected OTAs",
    delta: { value: "+4.1%", direction: "up" },
    method:
      "Every confirmed OTA reservation imported from Booking.com, Expedia and Agoda in the selected period, after cancellations and no-shows are removed.",
  },
  {
    id: "reached",
    label: "Guests reached",
    value: "8,240",
    context: "66.0% of OTA guests received at least one message",
    delta: { value: "+6.2%", direction: "up" },
    method:
      "Guests who received at least one delivered email or text from any journey stage. Guests without contact details or marketing consent are excluded.",
  },
  {
    id: "profiles",
    label: "Guest profiles captured",
    value: "3,218",
    context: "39.1% of guests reached shared verified details",
    delta: { value: "+11.4%", direction: "up" },
    method:
      "Guests who completed a stage form or verified their identity on a landing page, producing a first-party profile the hotel owns.",
  },
  {
    id: "conversions",
    label: "Direct conversions",
    value: "642",
    context: "7.8% of guests reached booked direct",
    delta: { value: "+18.2%", direction: "up" },
    emphasis: true,
    method:
      "Direct bookings attributed to OTA Buster through the booking engine, within 90 days of the guest receiving a journey message.",
  },
  {
    id: "revenue",
    label: "Direct revenue",
    value: "$84,200",
    context: "$131 average revenue per converted guest",
    delta: { value: "+18.4%", direction: "up" },
    emphasis: true,
    method:
      "Room revenue of attributed direct bookings, excluding taxes and cancelled reservations.",
  },
  {
    id: "commission",
    label: "Commission avoided",
    value: "$14,310",
    context: "17% blended OTA commission rate",
    delta: { value: "+16.8%", direction: "up" },
    method:
      "Direct revenue multiplied by the blended commission you would otherwise have paid the originating OTA.",
  },
];

/** The single opportunity surfaced in the product, with full provenance. */
export const opportunity = {
  headline: "1,248 OTA guests are eligible for a direct-conversion incentive",
  stageId: "winback",
  stageName: "Winback",
  guests: 1248,
  reached: 962,
  converted: 128,
  revenueOpportunity: "$46,800",
  supporting: [
    { label: "Property", value: "Wyndham Grand Istanbul Levent" },
    { label: "Guest segment", value: "Repeat OTA · Leisure · High value" },
    { label: "Source", value: "Booking.com, Expedia, Agoda" },
    { label: "Period", value: "Matches the selected date range" },
    { label: "Eligibility", value: "Stayed, not yet direct, no open complaint" },
    { label: "Offer attached", value: "15% off + free breakfast" },
    { label: "Guests reached", value: "962 of 1,248" },
    { label: "Guests converted", value: "128 (13.3%)" },
  ],
  method:
    "Eligible guests are OTA guests who completed a stay in the selected period, have never booked direct, hold marketing consent, have no unresolved complaint and have not received an incentive in the last 90 days. Revenue opportunity multiplies the remaining eligible guests by the segment conversion rate and its average direct booking value.",
  recommendation:
    "Guests who received 15% off + free breakfast converted 23% better than the current default offer in this stage.",
};

/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */

export const dateRanges = [
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Year to date",
  "Custom range",
];

export const propertyOptions = [
  "All properties",
  "Wyndham Grand Istanbul Levent",
  "Wyndham Grand Kalamış Marina",
  "Wyndham Grand Ankara",
];

export const channelOptions = ["All channels", "Email", "Text"];

export const stageOptions = [
  "All stages",
  "Just Booked",
  "Pre-Check-in",
  "Reminder",
  "During Stay",
  "Post-Checkout",
  "Winback",
];

export const segmentOptions = [
  "All segments",
  "First-time OTA guest",
  "Repeat OTA guest",
  "High-value guest",
  "Leisure",
  "Business",
  "Family",
  "Frequent traveller",
];

export const sourceOptions = ["All sources", "Booking.com", "Expedia", "Agoda", "Trip.com"];

export const conversionOptions = [
  "All guests",
  "Not yet converted",
  "Converted direct",
  "Repeat direct",
];

export const offerOptions = [
  "All offers",
  "10% off direct",
  "15% off + free breakfast",
  "Free breakfast",
  "Room upgrade",
  "Late checkout",
];

/* ------------------------------------------------------------------ */
/* Segments                                                            */
/* ------------------------------------------------------------------ */

export type Segment = {
  id: string;
  name: string;
  guests: number;
  share: string;
  conversionRate: string;
  delta: Delta;
  directRevenue: string;
  revenuePerGuest: string;
  bestOffer: string;
  bestChannel: string;
  recommendation: string;
};

export const segments: Segment[] = [
  {
    id: "repeat",
    name: "Repeat OTA guest",
    guests: 4218,
    share: "33.8% of OTA guests",
    conversionRate: "18.4%",
    delta: { value: "+3.2pt", direction: "up" },
    directRevenue: "$42,820",
    revenuePerGuest: "$10.15",
    bestOffer: "15% off + free breakfast",
    bestChannel: "Email + Text",
    recommendation: "Lead with recognition, not discount depth — loyalty framing lifts CTR 21%.",
  },
  {
    id: "first-time",
    name: "First-time OTA guest",
    guests: 5602,
    share: "44.9% of OTA guests",
    conversionRate: "6.1%",
    delta: { value: "+0.8pt", direction: "up" },
    directRevenue: "$18,240",
    revenuePerGuest: "$3.26",
    bestOffer: "Free breakfast",
    bestChannel: "Email",
    recommendation:
      "Capture the profile first. Incentivise on the post-stay stage, not at booking.",
  },
  {
    id: "high-value",
    name: "High-value guest",
    guests: 1104,
    share: "8.8% of OTA guests",
    conversionRate: "24.6%",
    delta: { value: "+5.1pt", direction: "up" },
    directRevenue: "$16,480",
    revenuePerGuest: "$14.93",
    bestOffer: "Complimentary upgrade",
    bestChannel: "Email",
    recommendation: "Use an upgrade rather than a discount — protects ADR at the same conversion.",
  },
  {
    id: "leisure",
    name: "Leisure",
    guests: 7860,
    share: "63.0% of OTA guests",
    conversionRate: "9.8%",
    delta: { value: "+1.6pt", direction: "up" },
    directRevenue: "$38,120",
    revenuePerGuest: "$4.85",
    bestOffer: "15% off + free breakfast",
    bestChannel: "Email",
    recommendation: "Pre-arrival timing outperforms post-stay for this segment by 12%.",
  },
  {
    id: "business",
    name: "Business",
    guests: 2286,
    share: "18.3% of OTA guests",
    conversionRate: "11.2%",
    delta: { value: "-0.4pt", direction: "down" },
    directRevenue: "$14,960",
    revenuePerGuest: "$6.54",
    bestOffer: "Late checkout",
    bestChannel: "Text",
    recommendation: "Service benefits beat discounts. Keep messages under 60 words.",
  },
  {
    id: "family",
    name: "Family",
    guests: 1682,
    share: "13.5% of OTA guests",
    conversionRate: "12.9%",
    delta: { value: "+2.1pt", direction: "up" },
    directRevenue: "$11,420",
    revenuePerGuest: "$6.79",
    bestOffer: "Free breakfast",
    bestChannel: "Email",
    recommendation: "Breakfast inclusion converts better than any percentage discount tested.",
  },
  {
    id: "frequent",
    name: "Frequent traveller",
    guests: 942,
    share: "7.5% of OTA guests",
    conversionRate: "20.8%",
    delta: { value: "+4.4pt", direction: "up" },
    directRevenue: "$13,640",
    revenuePerGuest: "$14.48",
    bestOffer: "Room upgrade",
    bestChannel: "Text",
    recommendation: "Shorten the journey — these guests convert on the first two touchpoints.",
  },
];

/* ------------------------------------------------------------------ */
/* Offer performance                                                   */
/* ------------------------------------------------------------------ */

export type OfferPerformance = {
  id: string;
  name: string;
  reached: number;
  conversions: number;
  conversionRate: string;
  delta: Delta;
  revenue: string;
  revenuePerGuest: string;
  commissionAvoided: string;
  bestSegment: string;
  bestStage: string;
  bestChannel: string;
};

export const offerPerformance: OfferPerformance[] = [
  {
    id: "fifteen-breakfast",
    name: "15% off + free breakfast",
    reached: 2840,
    conversions: 382,
    conversionRate: "13.4%",
    delta: { value: "+2.6pt", direction: "up" },
    revenue: "$38,420",
    revenuePerGuest: "$13.53",
    commissionAvoided: "$6,531",
    bestSegment: "Repeat OTA guest",
    bestStage: "Winback",
    bestChannel: "Email",
  },
  {
    id: "ten-off",
    name: "10% off direct",
    reached: 2412,
    conversions: 254,
    conversionRate: "10.5%",
    delta: { value: "+0.9pt", direction: "up" },
    revenue: "$21,640",
    revenuePerGuest: "$8.97",
    commissionAvoided: "$3,679",
    bestSegment: "Leisure",
    bestStage: "Post-Checkout",
    bestChannel: "Email",
  },
  {
    id: "breakfast",
    name: "Free breakfast",
    reached: 1980,
    conversions: 186,
    conversionRate: "9.4%",
    delta: { value: "+1.2pt", direction: "up" },
    revenue: "$14,260",
    revenuePerGuest: "$7.20",
    commissionAvoided: "$2,424",
    bestSegment: "Family",
    bestStage: "Pre-Check-in",
    bestChannel: "Email",
  },
  {
    id: "upgrade",
    name: "Complimentary upgrade",
    reached: 864,
    conversions: 128,
    conversionRate: "14.8%",
    delta: { value: "+3.4pt", direction: "up" },
    revenue: "$18,960",
    revenuePerGuest: "$21.94",
    commissionAvoided: "$3,223",
    bestSegment: "High-value guest",
    bestStage: "Winback",
    bestChannel: "Email",
  },
  {
    id: "late",
    name: "Late checkout",
    reached: 1242,
    conversions: 96,
    conversionRate: "7.7%",
    delta: { value: "-0.6pt", direction: "down" },
    revenue: "$7,180",
    revenuePerGuest: "$5.78",
    commissionAvoided: "$1,221",
    bestSegment: "Business",
    bestStage: "During Stay",
    bestChannel: "Text",
  },
];

/* ------------------------------------------------------------------ */
/* Channel & property performance                                      */
/* ------------------------------------------------------------------ */

export const channelPerformance = [
  {
    id: "email",
    name: "Email",
    sent: "18,420",
    openRate: "46.2%",
    ctr: "12.8%",
    conversions: 486,
    conversionRate: "8.4%",
    revenue: "$62,140",
    delta: { value: "+2.1pt", direction: "up" } as Delta,
  },
  {
    id: "text",
    name: "Text",
    sent: "5,240",
    openRate: "88.4%",
    ctr: "17.6%",
    conversions: 156,
    conversionRate: "6.9%",
    revenue: "$22,060",
    delta: { value: "+4.6pt", direction: "up" } as Delta,
  },
];

export const propertyPerformance = [
  {
    id: "levent",
    name: "Wyndham Grand Istanbul Levent",
    otaGuests: "6,842",
    reached: "4,620",
    conversions: 384,
    conversionRate: "8.3%",
    revenue: "$48,260",
    commission: "$8,204",
  },
  {
    id: "kalamis",
    name: "Wyndham Grand Kalamış Marina",
    otaGuests: "3,418",
    reached: "2,246",
    conversions: 162,
    conversionRate: "7.2%",
    revenue: "$22,140",
    commission: "$3,764",
  },
  {
    id: "ankara",
    name: "Wyndham Grand Ankara",
    otaGuests: "2,222",
    reached: "1,374",
    conversions: 96,
    conversionRate: "7.0%",
    revenue: "$13,800",
    commission: "$2,346",
  },
];

/* ------------------------------------------------------------------ */
/* Journey performance (stage funnel)                                  */
/* ------------------------------------------------------------------ */

export const journeyFunnel = [
  { id: "just-booked", name: "Just Booked", reached: 8240, converted: 62, revenue: "$7,140" },
  { id: "pre-checkin", name: "Pre-Check-in", reached: 6480, converted: 84, revenue: "$9,860" },
  { id: "reminder", name: "Reminder", reached: 5120, converted: 48, revenue: "$5,240" },
  { id: "during-stay", name: "During Stay", reached: 4260, converted: 96, revenue: "$12,420" },
  { id: "post-checkout", name: "Post-Checkout", reached: 3840, converted: 148, revenue: "$18,620" },
  { id: "winback", name: "Winback", reached: 2960, converted: 204, revenue: "$30,920" },
];

/* ------------------------------------------------------------------ */
/* Stage-level metrics — only what is relevant to each stage           */
/* ------------------------------------------------------------------ */

export type StageMetric = { label: string; value: string; delta?: Delta; hint?: string };

export const stageMetrics: Record<string, StageMetric[]> = {
  "just-booked": [
    { label: "Guests entered", value: "8,482" },
    { label: "Guests reached", value: "8,240", delta: { value: "+4.2%", direction: "up" } },
    { label: "Emails sent", value: "8,240" },
    { label: "Emails opened", value: "5,214", hint: "63.3% open rate" },
    { label: "Clicks", value: "1,196", delta: { value: "+8.1%", direction: "up" } },
    { label: "Click-through rate", value: "14.5%", delta: { value: "+1.2pt", direction: "up" } },
    { label: "Guest profiles captured", value: "3,218", hint: "39.1% of guests reached" },
    { label: "Google one-tap sign-ins", value: "1,842", hint: "22.4% of guests reached" },
    { label: "Direct conversions", value: "62", hint: "0.8% of guests reached" },
  ],
  "pre-checkin": [
    { label: "Guests reached", value: "6,480", delta: { value: "+3.4%", direction: "up" } },
    { label: "Emails sent", value: "6,480" },
    { label: "Emails opened", value: "3,842", hint: "59.3% open rate" },
    { label: "Clicks", value: "1,024" },
    { label: "Click-through rate", value: "15.8%", delta: { value: "+2.4pt", direction: "up" } },
    { label: "Offer engagement", value: "22.1%", hint: "Guests who opened the offer page" },
    { label: "Direct conversions", value: "84" },
    { label: "Direct revenue", value: "$9,860", delta: { value: "+12.4%", direction: "up" } },
  ],
  reminder: [
    { label: "Guests reached", value: "5,120" },
    { label: "Messages sent", value: "5,120" },
    { label: "Opens", value: "4,528", hint: "88.4% — text channel" },
    { label: "Clicks", value: "742" },
    { label: "Click-through rate", value: "14.5%", delta: { value: "-1.1pt", direction: "down" } },
    { label: "Direct conversions", value: "48" },
  ],
  "during-stay": [
    { label: "Guests reached", value: "4,260" },
    { label: "Messages sent", value: "4,260" },
    { label: "Engagement", value: "38.6%", delta: { value: "+2.8pt", direction: "up" } },
    { label: "Offer engagement", value: "18.4%" },
    { label: "Direct conversions", value: "96" },
    { label: "Direct revenue", value: "$12,420" },
  ],
  "post-checkout": [
    { label: "Guests reached", value: "3,840" },
    { label: "Emails sent", value: "3,840" },
    { label: "Emails opened", value: "2,164", hint: "56.4% open rate" },
    { label: "Reviews generated", value: "618", delta: { value: "+22.4%", direction: "up" } },
    { label: "Google review rating", value: "4.6", hint: "Up from 4.4 last period" },
    { label: "Direct conversions", value: "148" },
    { label: "Direct revenue", value: "$18,620", delta: { value: "+14.2%", direction: "up" } },
  ],
  winback: [
    { label: "Guests reached", value: "2,960" },
    { label: "Emails sent", value: "2,960" },
    { label: "Clicks", value: "684" },
    { label: "Click-through rate", value: "23.1%", delta: { value: "+3.8pt", direction: "up" } },
    { label: "Direct conversions", value: "204", delta: { value: "+18.2%", direction: "up" } },
    { label: "Conversion rate", value: "6.9%", delta: { value: "+1.1pt", direction: "up" } },
    { label: "Direct revenue", value: "$30,920" },
    { label: "Revenue per guest reached", value: "$10.45" },
    { label: "Commission avoided", value: "$5,256" },
  ],
};

export type ChannelEngagement = {
  engaged: string;
  clicks: string;
  responses: string;
  calls: string;
};

/**
 * The journey card's stat model. Three main sets — guests reached,
 * click-through rate and engagement — with clicks, responses and calls as
 * subsets of engagement, plus the full channel breakdown for the details popup.
 */
export type StageJourneyStats = {
  reach: { total: string; email: string; phone: string; delta?: Delta };
  ctr: { value: string; clicks: string; delta?: Delta };
  engagement: { rate: string; delta?: Delta; email: ChannelEngagement; phone: ChannelEngagement };
  collected: { email: string; phone: string; address: string };
};

export const stageJourneyStats: Record<string, StageJourneyStats> = {
  "just-booked": {
    reach: {
      total: "8,240",
      email: "5,760",
      phone: "2,480",
      delta: { value: "+4.2%", direction: "up" },
    },
    ctr: { value: "14.5%", clicks: "1,196", delta: { value: "+1.2pt", direction: "up" } },
    engagement: {
      rate: "11.8%",
      delta: { value: "+1.2pt", direction: "up" },
      email: { engaged: "812", clicks: "842", responses: "296", calls: "74" },
      phone: { engaged: "162", clicks: "354", responses: "132", calls: "112" },
    },
    collected: { email: "6,020", phone: "4,180", address: "2,340" },
  },
  "pre-checkin": {
    reach: {
      total: "6,480",
      email: "4,620",
      phone: "1,860",
      delta: { value: "+3.4%", direction: "up" },
    },
    ctr: { value: "15.8%", clicks: "1,024", delta: { value: "+2.4pt", direction: "up" } },
    engagement: {
      rate: "12.6%",
      delta: { value: "+2.4pt", direction: "up" },
      email: { engaged: "690", clicks: "728", responses: "342", calls: "48" },
      phone: { engaged: "126", clicks: "296", responses: "174", calls: "94" },
    },
    collected: { email: "4,940", phone: "3,120", address: "1,760" },
  },
  reminder: {
    reach: { total: "5,120", email: "1,240", phone: "3,880" },
    ctr: { value: "14.5%", clicks: "742", delta: { value: "-1.1pt", direction: "down" } },
    engagement: {
      rate: "16.2%",
      delta: { value: "-1.1pt", direction: "down" },
      email: { engaged: "58", clicks: "148", responses: "62", calls: "12" },
      phone: { engaged: "544", clicks: "594", responses: "329", calls: "62" },
    },
    collected: { email: "3,140", phone: "4,690", address: "1,208" },
  },
  "during-stay": {
    reach: { total: "4,260", email: "2,140", phone: "2,120" },
    ctr: { value: "16.2%", clicks: "690", delta: { value: "+1.8pt", direction: "up" } },
    engagement: {
      rate: "18.4%",
      delta: { value: "+2.8pt", direction: "up" },
      email: { engaged: "402", clicks: "322", responses: "288", calls: "36" },
      phone: { engaged: "382", clicks: "368", responses: "324", calls: "195" },
    },
    collected: { email: "2,780", phone: "2,410", address: "986" },
  },
  "post-checkout": {
    reach: { total: "3,840", email: "2,760", phone: "1,080" },
    ctr: { value: "21.5%", clicks: "824", delta: { value: "+2.2pt", direction: "up" } },
    engagement: {
      rate: "22.4%",
      delta: { value: "+0.6pt", direction: "up" },
      email: { engaged: "618", clicks: "612", responses: "486", calls: "22" },
      phone: { engaged: "242", clicks: "212", responses: "132", calls: "74" },
    },
    collected: { email: "3,050", phone: "1,960", address: "1,140" },
  },
  winback: {
    reach: { total: "2,960", email: "2,220", phone: "740" },
    ctr: { value: "23.1%", clicks: "684", delta: { value: "+3.8pt", direction: "up" } },
    engagement: {
      rate: "14.9%",
      delta: { value: "+1.1pt", direction: "up" },
      email: { engaged: "331", clicks: "528", responses: "164", calls: "18" },
      phone: { engaged: "110", clicks: "156", responses: "40", calls: "100" },
    },
    collected: { email: "2,210", phone: "1,320", address: "760" },
  },
};

/** Lightweight optimisation guidance per stage. */
export const stageInsight: Record<string, string> = {
  "just-booked":
    "Guests who complete the profile form here convert 2.4× more often later in the journey. Keep the form to three fields.",
  "pre-checkin":
    "Guests who received the free breakfast offer converted 23% better than guests who received no offer.",
  reminder:
    "Click-through fell 1.1pt this period. Sending 36 hours before arrival instead of 24 lifted CTR 9% in comparable properties.",
  "during-stay":
    "Offer engagement is highest on day two of the stay. Consider moving the send from arrival day.",
  "post-checkout":
    "Guests who left a 4–5 star review converted at 19.8% in Winback — nearly 3× the stage average.",
  winback:
    "Guests who received 15% off + free breakfast converted 23% better than the current default offer.",
};
