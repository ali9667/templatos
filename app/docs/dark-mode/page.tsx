import Link from "next/link";
import { ArrowLeft, ArrowRight, Moon, Sun } from "lucide-react";
import { CodeBlockWithCopy } from "@/components/docs/code-block-with-copy";
import { PageHeader } from "@/components/docs/page-header";
import { GlassButton } from "@/registry/liquid-glass/glass-button";

export default function DarkModePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:py-16">
      <PageHeader
        category="Customize"
        title="Dark mode"
        description="Templatos ships with one theme provider, mounted once in the root layout. Light is the default, and dark mode is always an explicit choice."
      />

      <section aria-labelledby="provider" className="border-y border-white/10 py-8">
        <div className="flex items-start gap-4">
          <Sun className="mt-1 size-5 text-amber-200" aria-hidden="true" />
          <div>
            <h2 id="provider" className="text-xl font-semibold text-white">One provider, mounted once</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">components/theme-provider.tsx</code> wraps{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">next-themes</code> and is mounted once in{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">app/layout.tsx</code>, around the Navbar, every
              page and the Footer. <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">enableSystem</code> is
              off and <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">defaultTheme</code> is{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">&quot;light&quot;</code>, so the operating
              system&apos;s preference is never used to switch the site into dark mode on its own.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <CodeBlockWithCopy
            language="tsx"
            filename="components/theme-provider.tsx"
            code={`"use client";\n\nimport { ThemeProvider as NextThemesProvider } from "next-themes";\n\nexport function ThemeProvider({ children, ...props }) {\n  return (\n    <NextThemesProvider\n      attribute="class"\n      defaultTheme="light"\n      enableSystem={false}\n      storageKey="templatos-theme"\n      disableTransitionOnChange\n      {...props}\n    >\n      {children}\n    </NextThemesProvider>\n  );\n}`}
          />
        </div>
      </section>

      <section aria-labelledby="toggle" className="py-10">
        <div className="flex items-start gap-4">
          <Moon className="mt-1 size-5 text-violet-300" aria-hidden="true" />
          <div>
            <h2 id="toggle" className="text-xl font-semibold text-white">The toggle is the only way in</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">components/shell/theme-toggle.tsx</code>{" "}
              lives in the Navbar on every page, including AI Studio and Docs. Switching it sets a{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">.dark</code> class on{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">&lt;html&gt;</code>, which every token in{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">app/globals.css</code> responds to, and the
              choice is remembered across visits.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="tokens" className="border-t border-white/10 py-10">
        <h2 id="tokens" className="text-xl font-semibold text-white">One set of tokens, two values</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
          Colors are defined once as CSS custom properties on <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">:root</code>,
          then overridden under <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">.dark</code>. Components
          reference the token (<code className="rounded bg-white/10 px-1.5 py-0.5 text-white">bg-background</code>,{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">text-foreground</code>,{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">border-border</code>), never a raw color, so
          nothing needs a separate dark-mode variant written by hand.
        </p>
        <div className="mt-5">
          <CodeBlockWithCopy
            language="css"
            filename="app/globals.css"
            code={`:root {\n  --background: #f5f2ec;\n  --foreground: #1a1922;\n  --brand: #4640c8;\n  /* ...and the rest of the palette */\n}\n\n.dark {\n  --background: #0f1017;\n  --foreground: #eeedf3;\n  --brand: #9c99ff;\n}`}
          />
        </div>
      </section>

      <section aria-labelledby="check" className="border-t border-white/10 py-10">
        <h2 id="check" className="text-xl font-semibold text-white">Before you ship</h2>
        <ul className="mt-4 grid gap-3 text-sm leading-6 text-white/60 sm:grid-cols-2">
          <li className="rounded-lg bg-white/[0.03] p-3">Never mount a second <code className="text-white">ThemeProvider</code> on a page — the root layout&apos;s is the only one.</li>
          <li className="rounded-lg bg-white/[0.03] p-3">Reference tokens (<code className="text-white">bg-card</code>, <code className="text-white">text-muted-foreground</code>) instead of hard-coded hex or Tailwind gray/slate classes.</li>
          <li className="rounded-lg bg-white/[0.03] p-3">Check text and focus contrast in both themes before shipping a new component.</li>
          <li className="rounded-lg bg-white/[0.03] p-3">A component that reads <code className="text-white">resolvedTheme</code> on first render should guard against the server/client mismatch, as <code className="text-white">ThemeToggle</code> does.</li>
        </ul>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/docs/theming">
          <GlassButton variant="ghost"><ArrowLeft className="mr-2 size-4" aria-hidden="true" />Theming</GlassButton>
        </Link>
        <Link href="/docs/cli">
          <GlassButton variant="primary">CLI <ArrowRight className="ml-2 size-4" aria-hidden="true" /></GlassButton>
        </Link>
      </div>
    </div>
  );
}
