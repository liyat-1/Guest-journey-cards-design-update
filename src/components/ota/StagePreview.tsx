import { useState } from "react";
import { Eye, Monitor, Smartphone } from "lucide-react";
import type { Stage } from "./journey";
import { Modal } from "./Modal";
import { Device, LandingRender, MessageRender, SuccessRender } from "./previews";

type Step = "message" | "landing" | "success";

export function StagePreview({
  stage,
  open,
  onOpenChange,
  initialStep = "message",
}: {
  stage: Stage;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialStep?: Step;
}) {
  const [step, setStep] = useState<Step>(initialStep);
  const [device, setDevice] = useState<"desktop" | "mobile">(
    stage.message.channel === "Text" ? "mobile" : "desktop",
  );

  const steps: { id: Step; label: string }[] = [
    { id: "message", label: `1 · ${stage.message.channel}` },
    { id: "landing", label: "2 · Landing" },
    { id: "success", label: "3 · Confirmation" },
  ];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      icon={Eye}
      eyebrow="Guest experience"
      title={stage.name}
      description={`${stage.message.channel} → landing → confirmation, exactly as the guest sees it.`}
      headerExtra={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-card">
            {steps.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`h-8 rounded-lg px-3 text-[12.5px] font-semibold transition-colors ${
                  step === s.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-card">
            {(
              [
                { id: "desktop", Icon: Monitor },
                { id: "mobile", Icon: Smartphone },
              ] as const
            ).map(({ id, Icon }) => (
              <button
                key={id}
                type="button"
                aria-label={id}
                onClick={() => setDevice(id)}
                className={`grid size-8 place-items-center rounded-lg transition-colors ${
                  device === id
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" strokeWidth={1.9} />
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="bg-secondary/30 px-6 py-7">
        <Device mode={device} chrome={step === "message" ? "mail" : "browser"}>
          {step === "message" && <MessageRender stage={stage} message={stage.message} />}
          {step === "landing" && <LandingRender stage={stage} />}
          {step === "success" && <SuccessRender stage={stage} />}
        </Device>
      </div>
    </Modal>
  );
}
