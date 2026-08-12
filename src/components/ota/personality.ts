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
  /** One word describing what this stage is for. */
  intent: string;
};

const fallback: StagePersona = {
  icon: Mail,
  tile: "bg-secondary text-muted-foreground",
  rail: "bg-border",
  intent: "Guest touchpoint",
};

export const stagePersona: Record<string, StagePersona> = {
  "just-booked": {
    icon: TicketCheck,
    tile: "bg-primary-soft text-primary",
    rail: "bg-primary/60",
    intent: "Booking confirmed",
  },
  "pre-checkin": {
    icon: ClipboardCheck,
    tile: "bg-primary-soft text-primary",
    rail: "bg-primary/45",
    intent: "Pre-arrival details",
  },
  reminder: {
    icon: BellRing,
    tile: "bg-gold-soft text-[oklch(0.5_0.11_82)]",
    rail: "bg-gold/70",
    intent: "Arrival nudge",
  },
  "during-stay": {
    icon: ConciergeBell,
    tile: "bg-success/12 text-success",
    rail: "bg-success/60",
    intent: "In-stay hospitality",
  },
  "post-checkout": {
    icon: Star,
    tile: "bg-gold-soft text-[oklch(0.5_0.11_82)]",
    rail: "bg-gold/70",
    intent: "Review & feedback",
  },
  winback: {
    icon: RotateCcw,
    tile: "bg-primary-soft text-primary",
    rail: "bg-primary/60",
    intent: "Re-engagement",
  },
};

export const persona = (stageId: string): StagePersona => stagePersona[stageId] ?? fallback;
