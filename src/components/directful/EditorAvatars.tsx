import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";
import { useState } from "react";
import type { Editor } from "./templates";

function AvatarPop({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={() => setOpen(true)}
          aria-label={`${editor.name}, updated ${editor.when}`}
          className={`grid size-6 place-items-center rounded-full ring-2 ring-card transition-transform hover:z-10 hover:-translate-y-0.5 ${editor.tint} text-[9.5px] font-semibold`}
        >
          {editor.initials}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="w-60 p-3">
        <div className="flex items-start gap-2.5">
          <span
            className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${editor.tint}`}
          >
            {editor.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold text-foreground">{editor.name}</p>
            <p className="text-[11.5px] text-muted-foreground">Updated {editor.precise}</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="-mt-0.5 -mr-1 grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-3.5" strokeWidth={2} />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MorePop({ editors, count }: { editors: Editor[]; count: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={() => setOpen(true)}
          aria-label={`${count} more editors`}
          className="grid size-6 place-items-center rounded-full bg-secondary text-[9.5px] font-semibold text-muted-foreground ring-2 ring-card transition-colors hover:bg-accent hover:text-foreground"
        >
          +{count}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" side="top" className="w-64 p-3">
        <div className="flex items-center justify-between pb-2">
          <p className="text-[10.5px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Recent editors
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="-mt-0.5 -mr-1 grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-3.5" strokeWidth={2} />
          </button>
        </div>
        <ul className="space-y-2">
          {editors.map((e) => (
            <li key={e.name} className="flex items-center gap-2.5">
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full text-[9.5px] font-semibold ${e.tint}`}
              >
                {e.initials}
              </span>
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-foreground">
                {e.name}
              </span>
              <span className="text-[11px] whitespace-nowrap text-muted-foreground">{e.when}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function EditorAvatars({ editors }: { editors: Editor[] }) {
  const shown = editors.slice(0, 2);
  const rest = editors.length - shown.length;

  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((e) => (
        <AvatarPop key={e.name} editor={e} />
      ))}
      {rest > 0 && <MorePop editors={editors} count={rest} />}
    </div>
  );
}
