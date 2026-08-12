import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, LayoutTemplate, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import type { Landing, Stage, Success } from "./journey";
import { fieldTypes } from "./stage-config";
import { Device, LandingRender, SuccessRender } from "./previews";
import { Modal, ModalSection } from "./Modal";
import { Btn, Field } from "./ui";
import { useOta } from "./state";

function TextInput({
  label,
  value,
  onChange,
  textarea,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  hint?: string;
}) {
  const cls =
    "mt-1.5 w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13.5px] text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";
  return (
    <label className="block">
      <span className="text-[11.5px] font-medium text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {hint && <span className="mt-1 block text-[11.5px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

/**
 * One modal for editing a guest-facing screen. Landing also owns data capture,
 * because the form is part of the landing page the guest completes.
 */
export function ExperienceEditor({
  stage,
  screen,
  open,
  onOpenChange,
}: {
  stage: Stage;
  screen: "landing" | "success";
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const {
    updateLanding,
    updateSuccess,
    configs,
    setFormEnabled,
    addField,
    updateField,
    removeField,
    moveField,
  } = useOta();
  const config = configs[stage.id]!;
  const [landing, setLanding] = useState<Landing>(stage.landing);
  const [success, setSuccess] = useState<Success>(stage.success);

  useEffect(() => {
    if (!open) return;
    setLanding(stage.landing);
    setSuccess(stage.success);
  }, [open, stage]);

  const isLanding = screen === "landing";

  const save = () => {
    if (isLanding) updateLanding(stage.id, landing);
    else updateSuccess(stage.id, success);
    toast.success(`${isLanding ? "Landing page" : "Confirmation page"} saved`);
    onOpenChange(false);
  };

  const draftStage: Stage = { ...stage, landing, success };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      icon={isLanding ? LayoutTemplate : CheckCircle2}
      eyebrow={isLanding ? "Step 2 · Landing page" : "Step 3 · Confirmation"}
      title={isLanding ? `Landing page for ${stage.name}` : `Confirmation for ${stage.name}`}
      description={
        isLanding
          ? "The page the guest opens: wording, stay details and the information you collect."
          : "The confirmation the guest lands on once they complete the step."
      }
      size="xl"
      footer={
        <div className="flex flex-wrap items-center gap-2">
          <Btn onClick={save}>Save changes</Btn>
          <Btn variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Btn>
          <p className="ml-auto text-[11.5px] text-muted-foreground">
            The preview shows the real guest page.
          </p>
        </div>
      }
    >
      <div className="grid gap-4 bg-secondary/25 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-4">
          {isLanding ? (
            <>
              <ModalSection label="Page copy" hint="What the guest reads first.">
                <div className="space-y-3.5">
                  <TextInput
                    label="Headline"
                    value={landing.headline}
                    onChange={(v) => setLanding((l) => ({ ...l, headline: v }))}
                  />
                  <TextInput
                    label="Supporting copy"
                    value={landing.sub}
                    onChange={(v) => setLanding((l) => ({ ...l, sub: v }))}
                    textarea
                  />
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <TextInput
                      label="Section title"
                      value={landing.sectionTitle}
                      onChange={(v) => setLanding((l) => ({ ...l, sectionTitle: v }))}
                    />
                    <TextInput
                      label="Button label"
                      value={landing.cta}
                      onChange={(v) => setLanding((l) => ({ ...l, cta: v }))}
                    />
                  </div>
                </div>
              </ModalSection>

              <ModalSection
                label="Stay details"
                hint="The reservation facts shown in the summary card."
              >
                <div className="space-y-2">
                  {landing.facts.map((f, i) => (
                    <div key={f.label + i} className="flex gap-2">
                      <input
                        value={f.label}
                        aria-label="Detail label"
                        onChange={(e) =>
                          setLanding((l) => ({
                            ...l,
                            facts: l.facts.map((x, xi) =>
                              xi === i ? { ...x, label: e.target.value } : x,
                            ),
                          }))
                        }
                        className="h-10 w-[42%] rounded-xl border border-input bg-card px-3 text-[13px] text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                      />
                      <input
                        value={f.value}
                        aria-label="Detail value"
                        onChange={(e) =>
                          setLanding((l) => ({
                            ...l,
                            facts: l.facts.map((x, xi) =>
                              xi === i ? { ...x, value: e.target.value } : x,
                            ),
                          }))
                        }
                        className="h-10 flex-1 rounded-xl border border-input bg-card px-3 text-[13px] text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                      />
                    </div>
                  ))}
                </div>
              </ModalSection>

              <ModalSection
                label="Guest data captured here"
                hint="Every field completed builds the guest profile you own."
                action={
                  <Switch
                    checked={config.formEnabled}
                    onCheckedChange={(v) => setFormEnabled(stage.id, v)}
                    aria-label="Collect guest details"
                  />
                }
              >
                {config.formEnabled ? (
                  <>
                    <div className="space-y-2">
                      {config.fields.map((f, i) => (
                        <div
                          key={f.id}
                          className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-secondary/40 p-2.5"
                        >
                          <input
                            value={f.label}
                            aria-label="Field label"
                            onChange={(e) => updateField(stage.id, f.id, { label: e.target.value })}
                            className="h-9 min-w-[140px] flex-1 rounded-lg border border-input bg-card px-3 text-[13px] text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                          />
                          <Field
                            label="Field type"
                            value={fieldTypes.find((t) => t.id === f.type)?.label ?? ""}
                            options={fieldTypes.map((t) => t.label)}
                            onChange={(v) => {
                              const type = fieldTypes.find((t) => t.label === v);
                              if (type) updateField(stage.id, f.id, { type: type.id });
                            }}
                            className="w-[160px]"
                          />
                          <label className="inline-flex items-center gap-2 px-1 text-[12.5px] text-muted-foreground">
                            <Switch
                              checked={f.required}
                              onCheckedChange={(v) => updateField(stage.id, f.id, { required: v })}
                              aria-label={`${f.label} required`}
                            />
                            Required
                          </label>
                          <div className="flex items-center gap-1">
                            <Btn
                              variant="ghost"
                              size="sm"
                              title="Move up"
                              disabled={i === 0}
                              onClick={() => moveField(stage.id, f.id, -1)}
                            >
                              <ArrowUp className="size-3.5" strokeWidth={2} />
                            </Btn>
                            <Btn
                              variant="ghost"
                              size="sm"
                              title="Move down"
                              disabled={i === config.fields.length - 1}
                              onClick={() => moveField(stage.id, f.id, 1)}
                            >
                              <ArrowDown className="size-3.5" strokeWidth={2} />
                            </Btn>
                            <Btn
                              variant="ghost"
                              size="sm"
                              title="Remove field"
                              onClick={() => removeField(stage.id, f.id)}
                            >
                              <Trash2 className="size-3.5" strokeWidth={2} />
                            </Btn>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Btn variant="secondary" size="sm" onClick={() => addField(stage.id)}>
                        <Plus className="size-3.5" strokeWidth={2.2} /> Add field
                      </Btn>
                      <p className="text-[11.5px] text-muted-foreground">
                        Keep it to three fields — completion drops sharply after that.
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="rounded-xl border border-dashed border-border-strong px-4 py-6 text-center text-[12.5px] text-muted-foreground">
                    No details are collected on this page. Turn capture on to build the guest
                    profile here.
                  </p>
                )}
              </ModalSection>
            </>
          ) : (
            <ModalSection
              label="Confirmation copy"
              hint="Reassure the guest and tell them what happens next."
            >
              <div className="space-y-3.5">
                <TextInput
                  label="Headline"
                  value={success.headline}
                  onChange={(v) => setSuccess((s) => ({ ...s, headline: v }))}
                />
                <TextInput
                  label="Next steps"
                  value={success.sub}
                  onChange={(v) => setSuccess((s) => ({ ...s, sub: v }))}
                  textarea
                />
                <TextInput
                  label="Confirmation points"
                  value={success.checks.join("\n")}
                  hint="One per line."
                  textarea
                  onChange={(v) =>
                    setSuccess((s) => ({
                      ...s,
                      checks: v.split("\n").filter((c) => c.trim().length > 0),
                    }))
                  }
                />
                <TextInput
                  label="Footer note"
                  value={success.footer ?? ""}
                  onChange={(v) => setSuccess((s) => ({ ...s, footer: v }))}
                />
              </div>
            </ModalSection>
          )}
        </div>

        <div className="lg:sticky lg:top-4">
          <div className="premium-panel edge-sheen p-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Live preview
            </p>
            <div className="mt-3">
              <Device mode="mobile">
                {isLanding ? (
                  <LandingRender
                    stage={draftStage}
                    {...(config.formEnabled ? { formFields: config.fields } : {})}
                  />
                ) : (
                  <SuccessRender stage={draftStage} />
                )}
              </Device>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
