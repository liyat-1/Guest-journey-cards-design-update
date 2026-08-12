import { useEffect, useState } from "react";
import { Mail, MessageSquareText, Monitor, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { tonePresets, type Stage, type StageMessage, type Tone } from "./journey";
import { Btn } from "./ui";
import { Modal, ModalSection } from "./Modal";
import { Device, MessageRender } from "./previews";
import { useOta } from "./state";

export function MessageEditor({
  stage,
  open,
  onOpenChange,
}: {
  stage: Stage;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { updateMessage } = useOta();
  const [draft, setDraft] = useState<StageMessage>(stage.message);
  const [device, setDevice] = useState<"desktop" | "mobile">(
    stage.message.channel === "Text" ? "mobile" : "desktop",
  );

  useEffect(() => {
    if (open) setDraft(stage.message);
  }, [open, stage.message]);

  const isText = draft.channel === "Text";
  const limit = 320;

  const insert = (token: string) => setDraft((d) => ({ ...d, body: `${d.body} ${token}` }));

  const save = () => {
    updateMessage(stage.id, draft);
    toast.success(`${stage.name} ${draft.channel.toLowerCase()} saved`);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      icon={isText ? MessageSquareText : Mail}
      eyebrow={`Step 1 · ${isText ? "Text message" : "Email"}`}
      title={`Compose the ${draft.channel.toLowerCase()} for ${stage.name}`}
      description={`${stage.purpose} Sent ${stage.message.timing.toLowerCase()}.`}
      size="xl"
      footer={
        <div className="flex flex-wrap items-center gap-2">
          <Btn onClick={save}>Save and return to stage</Btn>
          <Btn variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Btn>
          <p className="ml-auto text-[11.5px] text-muted-foreground">
            Changes appear in the live preview instantly.
          </p>
        </div>
      }
    >
      <div className="grid gap-4 bg-secondary/25 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="space-y-4">
          <ModalSection label="Channel and tone" hint="How this moment should sound to the guest.">
            <div className="flex gap-1 rounded-xl border border-border bg-secondary/60 p-1">
              {(["Email", "Text"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setDraft((d) => ({ ...d, channel: c }));
                    setDevice(c === "Text" ? "mobile" : "desktop");
                  }}
                  className={`h-9 flex-1 rounded-lg text-[12.5px] font-semibold transition-colors ${
                    draft.channel === c
                      ? "bg-card text-foreground shadow-card"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tonePresets.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, tone: t as Tone }))}
                  className={`h-8 rounded-full border px-3 text-[12px] font-semibold transition-colors ${
                    draft.tone === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </ModalSection>

          <ModalSection
            label={isText ? "Message" : "Email content"}
            hint={
              isText
                ? "One thought, one link. Texts should feel native to the channel."
                : "Subject, preview text and body — what lands in the guest's inbox."
            }
            action={
              isText ? (
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    draft.body.length > limit
                      ? "bg-destructive/10 text-destructive"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {draft.body.length}/{limit}
                </span>
              ) : undefined
            }
          >
            <div className="space-y-3.5">
              {!isText && (
                <>
                  <Field
                    label="Subject"
                    value={draft.subject}
                    onChange={(v) => setDraft((d) => ({ ...d, subject: v }))}
                  />
                  <Field
                    label="Preview text"
                    value={draft.preheader}
                    onChange={(v) => setDraft((d) => ({ ...d, preheader: v }))}
                  />
                </>
              )}

              <label className="block">
                <span className="text-[11.5px] font-medium text-muted-foreground">
                  {isText ? "Text message" : "Body"}
                </span>
                <textarea
                  value={draft.body}
                  onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                  rows={isText ? 4 : 9}
                  className="mt-1.5 w-full resize-y rounded-xl border border-input bg-card px-3.5 py-3 text-[13.5px] leading-relaxed text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </label>

              {!isText && (
                <Field
                  label="Button label"
                  value={draft.cta}
                  onChange={(v) => setDraft((d) => ({ ...d, cta: v }))}
                />
              )}
            </div>
          </ModalSection>

          <ModalSection
            label="Personalisation"
            hint={`Only tokens relevant to ${stage.name} are offered. Tap to insert.`}
          >
            <div className="flex flex-wrap gap-1.5">
              {draft.tokens.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => insert(t)}
                  className="rounded-lg border border-primary/25 bg-primary-soft/60 px-2.5 py-1.5 font-mono text-[11.5px] font-semibold text-primary transition-colors hover:bg-primary-soft"
                >
                  {t}
                </button>
              ))}
            </div>
          </ModalSection>
        </div>

        <div className="lg:sticky lg:top-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Live preview
              </p>
              <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-1">
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
                    className={`grid size-7 place-items-center rounded-md transition-colors ${
                      device === id
                        ? "bg-card text-primary shadow-card"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" strokeWidth={1.9} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <Device mode={device} chrome="mail">
                <MessageRender stage={stage} message={draft} />
              </Device>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11.5px] font-medium text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-card px-3.5 text-[13.5px] text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
      />
    </label>
  );
}
