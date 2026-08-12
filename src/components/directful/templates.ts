import { type PreviewVariant } from "./EmailPreview";

export type Editor = {
  name: string;
  initials: string;
  tint: string;
  when: string;
  precise: string;
};

export type Template = {
  id: string;
  name: string;
  tag?: string;
  isDefault?: boolean;
  description: string;
  campaigns: number;
  activeCampaigns: number;
  status: "Active" | "Draft";
  variant: PreviewVariant;
  usedIn: string[];
  editors: Editor[];
};

export const templates: Template[] = [
  {
    id: "default",
    name: "Default",
    tag: "Default",
    isDefault: true,
    description: "Clean and modern layout with a focused call to action.",
    campaigns: 12,
    activeCampaigns: 6,
    status: "Active",
    variant: "default",
    usedIn: ["Automated invites", "Before stay", "Drip campaign"],
    editors: [
      {
        name: "Maya Thompson",
        initials: "MT",
        tint: "bg-primary-soft text-primary",
        when: "2 days ago",
        precise: "Aug 8, 2026 at 3:42 PM",
      },
      {
        name: "Alex Kim",
        initials: "AK",
        tint: "bg-gold-soft text-[oklch(0.52_0.11_75)]",
        when: "6 days ago",
        precise: "Aug 4, 2026 at 10:18 AM",
      },
      {
        name: "Sarah Lee",
        initials: "SL",
        tint: "bg-secondary text-secondary-foreground",
        when: "8 days ago",
        precise: "Aug 2, 2026 at 9:05 AM",
      },
    ],
  },
  {
    id: "valley-lodge",
    name: "Valley Lodge",
    tag: "Valley Lodge",
    description: "Warm, centered header with an inline booking CTA.",
    campaigns: 18,
    activeCampaigns: 4,
    status: "Active",
    variant: "valley",
    usedIn: ["Automated invites", "Site abandonment", "Before stay", "Drip campaign"],
    editors: [
      {
        name: "David Ruiz",
        initials: "DR",
        tint: "bg-primary-soft text-primary",
        when: "3 days ago",
        precise: "Aug 7, 2026 at 5:20 PM",
      },
      {
        name: "Maya Thompson",
        initials: "MT",
        tint: "bg-secondary text-secondary-foreground",
        when: "5 days ago",
        precise: "Aug 5, 2026 at 11:02 AM",
      },
      {
        name: "Alex Kim",
        initials: "AK",
        tint: "bg-gold-soft text-[oklch(0.52_0.11_75)]",
        when: "9 days ago",
        precise: "Aug 1, 2026 at 4:47 PM",
      },
      {
        name: "Sarah Lee",
        initials: "SL",
        tint: "bg-secondary text-secondary-foreground",
        when: "12 days ago",
        precise: "Jul 29, 2026 at 8:31 AM",
      },
    ],
  },
  {
    id: "editorial-feature",
    name: "Editorial Feature",
    tag: "Editorial",
    description: "Tall hero, editorial spacing, and a prominent CTA.",
    campaigns: 6,
    activeCampaigns: 0,
    status: "Active",
    variant: "editorial",
    usedIn: ["Automated transactional", "Guest responses"],
    editors: [
      {
        name: "Sarah Lee",
        initials: "SL",
        tint: "bg-primary-soft text-primary",
        when: "2 weeks ago",
        precise: "Jul 27, 2026 at 1:15 PM",
      },
    ],
  },
];
