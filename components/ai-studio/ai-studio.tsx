"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, Copy, History, Loader2, RefreshCw, RotateCcw, Sparkles, Undo2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  EMPTY_PROFILE,
  FIELD_LIMITS,
  LENGTH_IDS,
  LENGTH_LABELS,
  PLATFORMS,
  PLATFORM_LIST,
  TONES,
  TONE_LIST,
  hasProfileContent,
  type GenerateSuccess,
  type LengthId,
  type PlatformId,
  type ProfileField,
  type ProfileInput,
  type ToneId,
} from "@/lib/ai/config";
import { ChoiceGroup } from "./choice-group";
import { PlatformPreview } from "./platform-preview";
import { useGeneration } from "./use-generation";

interface Snapshot {
  name: string;
  role: string;
  website: string;
}

interface HistoryEntry {
  id: number;
  result: GenerateSuccess;
  snapshot: Snapshot;
}

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-ring/30 aria-[invalid=true]:border-destructive";

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  count?: { value: number; max: number };
  children: React.ReactNode;
}

function Field({ id, label, optional = true, hint, error, count, children }: FieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
          {optional ? <span className="ml-1.5 font-normal text-muted-foreground">optional</span> : null}
        </label>
        {count ? (
          <span className={cn("font-mono text-xs tabular-nums text-muted-foreground", count.value > count.max * 0.9 && "text-destructive")}>
            {count.value}/{count.max}
          </span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function StepHeading({ id, step, title, note }: { id: string; step: number; title: string; note?: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span aria-hidden="true" className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {step}
      </span>
      <div>
        <h2 id={id} className="text-base font-semibold leading-6">{title}</h2>
        {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
      </div>
    </div>
  );
}

export function AiStudio() {
  const uid = useId();
  const resultRef = useRef<HTMLHeadingElement>(null);
  const { state, generate, cancel, clear, restore } = useGeneration();

  const [profile, setProfile] = useState<ProfileInput>(EMPTY_PROFILE);
  const [platform, setPlatform] = useState<PlatformId>("linkedin");
  const [tone, setTone] = useState<ToneId>("professional");
  const [length, setLength] = useState<LengthId>("medium");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ProfileField, string>>>({});
  const [draft, setDraft] = useState("");
  const [snapshot, setSnapshot] = useState<Snapshot>({ name: "", role: "", website: "" });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);

  const loading = state.status === "loading";
  const result = state.result;
  const edited = result ? draft !== result.text : false;
  const settingsChanged = result ? result.platform !== platform || result.tone !== tone || result.length !== length : false;

  const setField = (field: ProfileField) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((previous) => ({ ...previous, [field]: event.target.value }));
    setFieldErrors((previous) => (previous[field] ? { ...previous, [field]: undefined } : previous));
  };

  const run = useCallback(async () => {
    if (!hasProfileContent(profile)) {
      setFieldErrors({ about: "Add at least a name, role, skills or a sentence about yourself." });
      document.getElementById(`${uid}-about`)?.focus();
      return;
    }
    setFieldErrors({});
    const next = await generate({ profile, platform, tone, length });
    if (next) {
      const snap = { name: profile.name.trim(), role: profile.role.trim(), website: profile.website.trim() };
      setSnapshot(snap);
      setDraft(next.text);
      setHistory((previous) => [{ id: Date.now(), result: next, snapshot: snap }, ...previous].slice(0, 6));
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        resultRef.current?.focus({ preventScroll: true });
      }
    }
  }, [generate, length, platform, profile, tone, uid]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    void run();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy automatically. Select the text and copy it manually.");
    }
  };

  const resetAll = () => {
    clear();
    setProfile(EMPTY_PROFILE);
    setPlatform("linkedin");
    setTone("professional");
    setLength("medium");
    setFieldErrors({});
    setDraft("");
    setSnapshot({ name: "", role: "", website: "" });
  };

  const openEntry = (entry: HistoryEntry) => {
    restore(entry.result);
    setDraft(entry.result.text);
    setSnapshot(entry.snapshot);
  };

  const mergedErrors = useMemo(() => ({ ...(state.error?.fields ?? {}), ...fieldErrors }), [state.error, fieldErrors]);
  const dirty = useMemo(() => Object.values(profile).some(Boolean) || Boolean(result), [profile, result]);
  const overLimit = result ? draft.length > result.limit : false;

  const fieldProps = (field: ProfileField) => ({
    id: `${uid}-${field}`,
    "aria-invalid": mergedErrors[field] ? (true as const) : undefined,
    "aria-describedby": mergedErrors[field] ? `${uid}-${field}-error` : `${uid}-${field}-hint`,
    value: profile[field],
    onChange: setField(field),
    maxLength: FIELD_LIMITS[field],
    className: inputClass,
  });

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* ---------- Input ---------- */}
      <form onSubmit={submit} noValidate aria-label="Profile details" className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-raised)] sm:p-6">
        <div className="space-y-8">
          <section aria-labelledby={`${uid}-s1`}>
            <StepHeading id={`${uid}-s1`} step={1} title="About you" note="Fill in what you have. Every field is optional, but one needs to be there." />
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={`${uid}-name`} label="Name" error={mergedErrors.name}>
                  <input type="text" autoComplete="name" placeholder="Maya Rivera" {...fieldProps("name")} />
                </Field>
                <Field id={`${uid}-role`} label="Role" error={mergedErrors.role}>
                  <input type="text" placeholder="Frontend developer" {...fieldProps("role")} />
                </Field>
              </div>
              <Field id={`${uid}-skills`} label="Skills" hint="Separate with commas." error={mergedErrors.skills}>
                <input type="text" placeholder="React, TypeScript, accessibility, design systems" {...fieldProps("skills")} />
              </Field>
              <Field id={`${uid}-about`} label="About yourself" count={{ value: profile.about.length, max: FIELD_LIMITS.about }} hint="What you do, who you help, what you care about." error={mergedErrors.about}>
                <textarea rows={4} placeholder="I build interfaces for small teams and care a lot about the details people don't notice until they're missing." {...fieldProps("about")} />
              </Field>
              <Field id={`${uid}-experience`} label="Experience" count={{ value: profile.experience.length, max: FIELD_LIMITS.experience }} hint="Roles, projects or results you can stand behind." error={mergedErrors.experience}>
                <textarea rows={3} placeholder="4 years building product UI. Led the redesign of a design system used by three teams." {...fieldProps("experience")} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={`${uid}-interests`} label="Interests" error={mergedErrors.interests}>
                  <input type="text" placeholder="Typography, cycling, coffee" {...fieldProps("interests")} />
                </Field>
                <Field id={`${uid}-website`} label="Website or portfolio" error={mergedErrors.website}>
                  <input type="text" inputMode="url" autoComplete="url" placeholder="mayarivera.dev" {...fieldProps("website")} />
                </Field>
              </div>
              <Field id={`${uid}-instructions`} label="Custom instructions" count={{ value: profile.instructions.length, max: FIELD_LIMITS.instructions }} hint="For example: mention I'm open to freelance work." error={mergedErrors.instructions}>
                <textarea rows={2} {...fieldProps("instructions")} />
              </Field>
            </div>
          </section>

          <section aria-labelledby={`${uid}-s2`}>
            <StepHeading id={`${uid}-s2`} step={2} title="Platform" />
            <ChoiceGroup
              legend="Where will this be used?"
              name={`${uid}-platform`}
              value={platform}
              onChange={setPlatform}
              choices={PLATFORM_LIST.map((p) => ({ id: p.id, label: p.label }))}
              columns="grid-cols-2 sm:grid-cols-4"
              hint={PLATFORMS[platform].hint}
            />
          </section>

          <section aria-labelledby={`${uid}-s3`}>
            <StepHeading id={`${uid}-s3`} step={3} title="Style" />
            <div className="space-y-5">
              <ChoiceGroup
                legend="Tone"
                name={`${uid}-tone`}
                value={tone}
                onChange={setTone}
                choices={TONE_LIST.map((t) => ({ id: t.id, label: t.label, description: t.description }))}
                columns="grid-cols-2"
              />
              <ChoiceGroup
                legend="Length"
                name={`${uid}-length`}
                value={length}
                onChange={setLength}
                choices={LENGTH_IDS.map((id) => ({ id, label: LENGTH_LABELS[id], description: `up to ${PLATFORMS[platform].targets[id]}` }))}
                columns="grid-cols-3"
              />
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <Button type="submit" size="lg" disabled={loading} aria-busy={loading} className="min-w-40">
              {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
              {loading ? "Writing…" : result ? "Generate again" : "Generate"}
            </Button>
            <Button type="button" variant="ghost" size="lg" onClick={resetAll} disabled={loading || !dirty}>
              <RotateCcw aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>
      </form>

      {/* ---------- Result ---------- */}
      <section aria-labelledby={`${uid}-result`} className="space-y-4 lg:sticky lg:top-20">
        <div className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-raised)] sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id={`${uid}-result`} ref={resultRef} tabIndex={-1} className="text-base font-semibold outline-none">
              {result ? `${PLATFORMS[result.platform].label} · ${TONES[result.tone].label}` : "Your profile text"}
            </h2>
            {loading ? (
              <Button type="button" variant="ghost" size="sm" onClick={cancel}>
                <X aria-hidden="true" /> Cancel
              </Button>
            ) : null}
          </div>

          <div aria-live="polite" className="sr-only">
            {loading ? "Generating your profile text." : state.status === "success" ? "Your profile text is ready." : ""}
          </div>

          {/* error */}
          {state.status === "error" && state.error ? (
            <div role="alert" className="mb-4 flex gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-destructive">Couldn&apos;t generate</p>
                <p className="mt-1 text-foreground/80">{state.error.message}</p>
                {state.error.retryable ? (
                  <Button type="button" size="sm" variant="outline" className="mt-3" onClick={() => void run()}>
                    <RefreshCw aria-hidden="true" /> Try again
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* loading (first run) */}
          {loading && !result ? (
            <div aria-hidden="true" className="space-y-3">
              <div className="h-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-1/3 rounded-full bg-brand" style={{ animation: "loading-bar 1.4s ease-in-out infinite" }} />
              </div>
              <div className="h-4 w-11/12 rounded bg-secondary" />
              <div className="h-4 w-full rounded bg-secondary" />
              <div className="h-4 w-4/5 rounded bg-secondary" />
              <p className="pt-2 text-sm text-muted-foreground">Writing your {PLATFORMS[platform].label} text. This usually takes a few seconds.</p>
            </div>
          ) : null}

          {/* empty */}
          {state.status === "idle" && !result ? (
            <div className="rounded-md border border-dashed border-border bg-background px-5 py-10 text-center">
              <Sparkles className="mx-auto size-5 text-brand" aria-hidden="true" />
              <p className="mt-3 font-medium">Tell us about yourself to get started.</p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                Add a few details, pick a platform and a tone, then generate. You can edit the result before you copy it.
              </p>
            </div>
          ) : null}

          {/* success (also shown, dimmed, while regenerating) */}
          {result ? (
            <div className={cn("space-y-3 transition-opacity", loading && "opacity-50")} aria-busy={loading}>
              {loading ? (
                <div aria-hidden="true" className="h-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-1/3 rounded-full bg-brand" style={{ animation: "loading-bar 1.4s ease-in-out infinite" }} />
                </div>
              ) : null}
              <label htmlFor={`${uid}-draft`} className="sr-only">
                Generated text, editable
              </label>
              <textarea
                id={`${uid}-draft`}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                readOnly={loading}
                rows={result.platform === "linkedin" ? 10 : 5}
                aria-describedby={`${uid}-count`}
                className={cn(inputClass, "resize-y leading-6", overLimit && "border-destructive")}
              />
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <p id={`${uid}-count`} className={cn("font-mono tabular-nums", overLimit && "text-destructive")}>
                  {draft.length} / {result.limit} characters
                  {overLimit ? ` — ${draft.length - result.limit} over the ${PLATFORMS[result.platform].label} limit` : ""}
                </p>
                <p>Edit freely. The preview updates as you type.</p>
              </div>
              {result.truncated ? (
                <p className="rounded-md bg-secondary px-3 py-2 text-xs text-muted-foreground">The first draft was slightly over the platform limit, so it was shortened to fit.</p>
              ) : null}
              {settingsChanged && !loading ? (
                <p className="rounded-md bg-brand-soft px-3 py-2 text-xs text-accent-foreground">You changed the settings. Generate again to apply them.</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={copy} disabled={!draft.trim()}>
                  {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button type="button" variant="outline" onClick={() => void run()} disabled={loading}>
                  <RefreshCw aria-hidden="true" /> Regenerate
                </Button>
                {edited ? (
                  <Button type="button" variant="ghost" onClick={() => setDraft(result.text)} disabled={loading}>
                    <Undo2 aria-hidden="true" /> Undo edits
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {/* preview */}
        {result ? (
          <div>
            <h3 className="mb-2 text-sm font-semibold">Preview on {PLATFORMS[result.platform].label}</h3>
            <PlatformPreview platform={result.platform} text={draft} name={snapshot.name} role={snapshot.role} website={snapshot.website} />
            <p className="mt-2 text-xs text-muted-foreground">An illustration of the layout using your text. Not a live view of the platform.</p>
          </div>
        ) : null}

        {/* history */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <History className="size-4 text-muted-foreground" aria-hidden="true" /> This session
            </h3>
            {history.length > 0 ? (
              <button type="button" onClick={() => setHistory([])} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Clear
              </button>
            ) : null}
          </div>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No generations yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {history.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => openEntry(entry)}
                    className="flex w-full flex-col gap-0.5 rounded-md px-1 py-2 text-left transition-colors hover:bg-secondary"
                  >
                    <span className="text-xs font-medium text-brand">
                      {PLATFORMS[entry.result.platform].label} · {TONES[entry.result.tone].label} · {LENGTH_LABELS[entry.result.length]}
                    </span>
                    <span className="line-clamp-1 text-sm text-muted-foreground">{entry.result.text.replace(/\s+/g, " ")}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">Kept in this tab only. Nothing is saved on a server.</p>
        </div>
      </section>
    </div>
  );
}
