/**
 * Subtle, purpose-driven personality per journey stage.
 * Same visual language everywhere — only the accent and the icon change.
 */
import {
  BellRing,
  ClipboardCheck,
  ConciergeBell,
  Mail,
  RotateCcw,
  Star,
  TicketCheck,
  type LucideIcon,
} from "lucide-react";

export type StagePersona = {
  icon: LucideIcon;
  /** Icon tile classes. */
  tile: string;
  /** Thin accent rail on the left of the card. */
  rail: string;
  /** Soft tinted wash for the card's leading column. */
  wash: string;
  /** Accent text colour for the stage. */
  ink: string;
  /** Hover border colour for the card. */
  edge: string;
  /** One word describing what this stage is for. */
  intent: string;
};

const fallback: StagePersona = {
  icon: Mail,
  tile: "bg-secondary text-muted-foreground",
  rail: "bg-border-strong",
  wash: "from-secondary/60",
  ink: "text-muted-foreground",
  edge: "hover:border-border-strong",
  intent: "Guest touchpoint",
};

export const stagePersona: Record<string, StagePersona> = {
  "just-booked": {
    icon: TicketCheck,
    tile: "bg-tone-sky-soft text-tone-sky ring-1 ring-tone-sky/15",
    rail: "bg-tone-sky",
    wash: "from-tone-sky-soft/70",
    ink: "text-tone-sky",
    edge: "hover:border-tone-sky/35",
    intent: "Booking confirmed",
  },
  "pre-checkin": {
    icon: ClipboardCheck,
    tile: "bg-tone-teal-soft text-tone-teal ring-1 ring-tone-teal/15",
    rail: "bg-tone-teal",
    wash: "from-tone-teal-soft/70",
    ink: "text-tone-teal",
    edge: "hover:border-tone-teal/35",
    intent: "Pre-arrival details",
  },
  reminder: {
    icon: BellRing,
    tile: "bg-tone-amber-soft text-tone-amber ring-1 ring-tone-amber/15",
    rail: "bg-tone-amber",
    wash: "from-tone-amber-soft/70",
    ink: "text-tone-amber",
    edge: "hover:border-tone-amber/35",
    intent: "Arrival nudge",
  },
  "during-stay": {
    icon: ConciergeBell,
    tile: "bg-tone-moss-soft text-tone-moss ring-1 ring-tone-moss/15",
    rail: "bg-tone-moss",
    wash: "from-tone-moss-soft/70",
    ink: "text-tone-moss",
    edge: "hover:border-tone-moss/35",
    intent: "In-stay hospitality",
  },
  "post-checkout": {
    icon: Star,
    tile: "bg-tone-clay-soft text-tone-clay ring-1 ring-tone-clay/15",
    rail: "bg-tone-clay",
    wash: "from-tone-clay-soft/70",
    ink: "text-tone-clay",
    edge: "hover:border-tone-clay/35",
    intent: "Review & feedback",
  },
  winback: {
    icon: RotateCcw,
    tile: "bg-tone-plum-soft text-tone-plum ring-1 ring-tone-plum/15",
    rail: "bg-tone-plum",
    wash: "from-tone-plum-soft/70",
    ink: "text-tone-plum",
    edge: "hover:border-tone-plum/35",
    intent: "Re-engagement",
  },
};

export const persona = (stageId: string): StagePersona => stagePersona[stageId] ?? fallback;
