import { Copy, Eye, Megaphone, MoreHorizontal, Pencil, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmailPreview } from "./EmailPreview";
import { EditorAvatars } from "./EditorAvatars";
import type { Template } from "./templates";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function IconAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

export function TemplateCard({
  template,
  onPreview,
}: {
  template: Template;
  onPreview: (t: Template) => void;
}) {
  const act = (msg: string) => () => toast(msg);

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover">
      {/* Email preview */}
      <div className="relative border-b border-border bg-secondary/60 p-4">
        {template.tag && (
          <span className="absolute top-6 left-6 z-10 rounded-[4px] bg-foreground/85 px-2 py-1 text-[9.5px] font-semibold tracking-[0.12em] text-background uppercase backdrop-blur-sm">
            {template.tag}
          </span>
        )}
        <div className="h-[290px] overflow-hidden rounded-md border border-border bg-white shadow-sm">
          <EmailPreview variant={template.variant} />
        </div>
        <button
          type="button"
          onClick={() => onPreview(template)}
          className="absolute inset-0 grid place-items-center bg-foreground/0 opacity-0 transition-all duration-200 group-hover:bg-foreground/10 group-hover:opacity-100"
          aria-label={`Preview ${template.name}`}
        >
          <span className="inline-flex items-center gap-2 rounded-md bg-card px-3.5 py-2 text-[12.5px] font-semibold text-foreground shadow-pop">
            <Eye className="size-4" strokeWidth={1.75} /> Preview email
          </span>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-[15.5px] font-semibold tracking-[-0.01em] text-foreground">
            {template.name}
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            {template.description}
          </p>
        </div>

        {/* Metadata — single horizontal row */}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-3.5">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[12.5px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Megaphone className="size-[15px]" strokeWidth={1.75} />
                <span className="font-semibold text-foreground">{template.campaigns}</span>
                campaigns
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60 p-3">
              <p className="pb-2 text-[10.5px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Used in
              </p>
              <ul className="space-y-1.5">
                {template.usedIn.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-[12.5px] text-foreground">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-border pt-2.5 text-[11.5px] text-muted-foreground">
                <span className="font-semibold text-foreground">{template.activeCampaigns}</span> of{" "}
                {template.campaigns} currently active
              </p>
            </PopoverContent>
          </Popover>

          <span className="h-3 w-px bg-border" />

          <span
            className={`inline-flex items-center gap-1.5 text-[12.5px] ${
              template.activeCampaigns > 0 ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${template.activeCampaigns > 0 ? "bg-success" : "bg-border-strong"}`}
            />
            <span className="font-semibold">{template.activeCampaigns}</span>
            <span className="text-muted-foreground">active</span>
          </span>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[12px] text-muted-foreground">Updated</span>
            <EditorAvatars editors={template.editors} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={act(`Opening the email designer for ${template.name}`)}
            className="inline-flex h-8 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-[12.5px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <SquarePen className="size-[15px]" strokeWidth={2} /> Edit design
          </button>
          <IconAction label="Preview" onClick={() => onPreview(template)}>
            <Eye className="size-[15px]" strokeWidth={1.75} />
          </IconAction>
          <IconAction label="Duplicate" onClick={act(`Duplicated ${template.name}`)}>
            <Copy className="size-[15px]" strokeWidth={1.75} />
          </IconAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More actions"
                className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground"
              >
                <MoreHorizontal className="size-[15px]" strokeWidth={1.75} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onSelect={act(`Rename ${template.name}`)}>
                <Pencil className="size-4" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={act(
                  `${template.activeCampaigns} of ${template.campaigns} campaigns are active`,
                )}
              >
                <Megaphone className="size-4" /> View campaigns
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {template.isDefault ? (
                <div className="px-2 py-1.5 text-[11.5px] leading-snug text-muted-foreground">
                  Default templates cannot be deleted.
                </div>
              ) : (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={act(`Deleted ${template.name}`)}
                >
                  <Trash2 className="size-4" /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}
