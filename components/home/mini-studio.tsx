"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ChoiceGroup } from "@/components/ai-studio/choice-group";
import { PlatformPreview } from "@/components/ai-studio/platform-preview";
import { buttonVariants } from "@/components/ui/button";
import { PLATFORMS, PLATFORM_LIST, TONE_LIST, type PlatformId, type ToneId } from "@/lib/ai/config";
import { SAMPLE_OUTPUT, SAMPLE_PROFILE } from "@/lib/samples";
import { cn } from "@/lib/utils";

/**
 * A small, working version of AI Studio's output side: switch platform and tone and the
 * preview responds. The text is pre-written sample content, and it says so.
 */
export function MiniStudio() {
  const uid = useId();
  const [platform, setPlatform] = useState<PlatformId>("linkedin");
  const [tone, setTone] = useState<ToneId>("professional");
  const text = SAMPLE_OUTPUT[platform][tone];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
      <div className="space-y-6">
        <dl className="rounded-md border border-border bg-card p-4 text-sm shadow-[var(--shadow-raised)]">
          <p className="mb-3 text-xs font-medium text-muted-foreground">Sample profile</p>
          <div className="space-y-2">
            {(
              [
                ["Name", SAMPLE_PROFILE.name],
                ["Role", SAMPLE_PROFILE.role],
                ["Skills", SAMPLE_PROFILE.skills],
                ["Experience", SAMPLE_PROFILE.experience],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="grid grid-cols-[5.5rem_1fr] gap-2">
                <dt className="text-muted-foreground">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </div>
        </dl>
        <ChoiceGroup
          legend="Platform"
          name={`${uid}-platform`}
          value={platform}
          onChange={setPlatform}
          choices={PLATFORM_LIST.map((p) => ({ id: p.id, label: p.label }))}
          columns="grid-cols-2"
        />
        <ChoiceGroup
          legend="Tone"
          name={`${uid}-tone`}
          value={tone}
          onChange={setTone}
          choices={TONE_LIST.map((t) => ({ id: t.id, label: t.label }))}
          columns="grid-cols-2"
        />
      </div>

      <div>
        <div aria-live="polite">
          <PlatformPreview platform={platform} text={text} name={SAMPLE_PROFILE.name} role={SAMPLE_PROFILE.role} website={SAMPLE_PROFILE.website} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs tabular-nums text-muted-foreground">
            {text.length} / {PLATFORMS[platform].maxChars} characters
          </p>
          <p className="text-xs text-muted-foreground">Sample text, written in advance.</p>
        </div>
        <Link href="/ai" className={cn(buttonVariants({ size: "lg" }), "mt-5")}>
          Write your own in AI Studio
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
