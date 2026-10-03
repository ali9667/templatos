import type { Metadata } from "next";
import { AiStudio } from "@/components/ai-studio/ai-studio";

export const metadata: Metadata = {
  title: "AI Studio",
  description:
    "Write a bio for Instagram, LinkedIn, X or Telegram from your own details. Pick a tone and length, edit the result, and copy it.",
  alternates: { canonical: "/ai" },
};

export default function AiStudioPage() {
  return (
    <div className="bg-[color-mix(in_oklab,var(--brand-soft)_40%,var(--background))]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
        <header className="mb-8 max-w-2xl lg:mb-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">AI Studio</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Write a bio for Instagram, LinkedIn, X or Telegram from your own details. Choose a tone and a length, edit the
            result, and copy it.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Templatos doesn&apos;t store what you enter. It&apos;s sent to OpenRouter only to write your text.
          </p>
        </header>
        <AiStudio />
      </div>
    </div>
  );
}
