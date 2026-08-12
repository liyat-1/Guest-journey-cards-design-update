import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  Globe2,
  MailOpen,
  MessageSquare,
  MessagesSquare,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  ShoppingCart,
  ThumbsUp,
  LayoutTemplate,
  Zap,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { property } from "@/components/ota/journey";

type Item = { label: string; icon: typeof BarChart3; to?: string };

const overview: Item[] = [
  { label: "Analytics", icon: BarChart3 },
  { label: "Bookings", icon: CalendarDays },
  { label: "GDS bookings", icon: Globe2 },
];

const marketing: Item[] = [
  { label: "Automated invites", icon: MessagesSquare },
  { label: "Automated transactional", icon: MailOpen },
  { label: "Drip campaign", icon: Send },
  { label: "Guest responses", icon: ThumbsUp },
  { label: "Before stay", icon: Moon },
  { label: "Site abandonment", icon: ShoppingCart },
  { label: "OTA Buster", icon: Zap, to: "/ota-buster" },
];

const assets: Item[] = [{ label: "Email templates", icon: LayoutTemplate, to: "/email-templates" }];

const inProperty: Item[] = [
  { label: "Arrivals & In-house", icon: CalendarDays },
  { label: "Messaging", icon: MessageSquare },
];

function NavItem({
  label,
  icon: Icon,
  to,
  active,
  collapsed,
}: Item & { active?: boolean; collapsed: boolean }) {
  const cls = `group flex w-full items-center rounded-md text-left text-[13.5px] transition-colors ${
    collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2"
  } ${
    active
      ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
      : "text-sidebar-foreground hover:bg-secondary"
  }`;
  const inner = (
    <>
      <Icon
        className={`size-[17px] shrink-0 ${active ? "text-sidebar-accent-foreground" : "text-muted-foreground"}`}
        strokeWidth={1.75}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </>
  );

  const node = to ? (
    <Link to={to} className={cls} aria-current={active ? "page" : undefined} aria-label={label}>
      {inner}
    </Link>
  ) : (
    <button type="button" className={cls} aria-label={label}>
      {inner}
    </button>
  );

  if (!collapsed) return node;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{node}</TooltipTrigger>
      <TooltipContent side="right" className="text-[12px]">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function GroupLabel({ children, collapsed }: { children: string; collapsed: boolean }) {
  if (collapsed) return <div className="mx-auto my-2 h-px w-6 bg-sidebar-border" />;
  return (
    <p className="px-3 pb-1.5 text-[10.5px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function AppSidebar({
  collapsed = false,
  onToggle,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (item: Item) =>
    item.to === "/" ? pathname === "/" : Boolean(item.to && pathname.startsWith(item.to));

  const groups: { label: string; items: Item[] }[] = [
    { label: "Overview", items: overview },
    { label: "Marketing", items: marketing },
    { label: "Assets", items: assets },
    { label: "In property", items: inProperty },
  ];

  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out md:flex ${
        collapsed ? "w-[64px]" : "w-[270px]"
      }`}
    >
      <div
        className={`flex items-center border-b border-sidebar-border py-4 ${
          collapsed ? "justify-center px-2" : "gap-3 px-5"
        }`}
      >
        {collapsed ? (
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-[12px] font-semibold text-primary-foreground">
            WG
          </span>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-[10.5px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Wyndham Grand
              </p>
              <p className="truncate text-[15px] font-semibold text-foreground">
                <span className="text-muted-foreground">223</span>{" "}
                {property.replace("Wyndham Grand ", "")}
              </p>
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </>
        )}
      </div>

      <nav className={`flex-1 space-y-5 overflow-y-auto py-5 ${collapsed ? "px-2" : "px-2"}`}>
        {groups.map((g) => (
          <div key={g.label} className="space-y-0.5">
            <GroupLabel collapsed={collapsed}>{g.label}</GroupLabel>
            {g.items.map((i) => (
              <NavItem key={i.label} {...i} active={isActive(i)} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </nav>

      {onToggle && (
        <div className={`border-t border-sidebar-border p-2 ${collapsed ? "" : "px-3"}`}>
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex w-full items-center rounded-md py-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground ${
              collapsed ? "justify-center" : "gap-2.5 px-2"
            }`}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-[17px]" strokeWidth={1.75} />
            ) : (
              <>
                <PanelLeftClose className="size-[17px]" strokeWidth={1.75} />
                Collapse
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
}
