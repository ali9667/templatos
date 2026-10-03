import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ComponentStage } from "@/components/docs/component-stage";
import { PlatformPreview } from "@/components/ai-studio/platform-preview";
import { MiniStudio } from "@/components/home/mini-studio";
import { buttonVariants } from "@/components/ui/button";
import { GlassBadge } from "@/registry/liquid-glass/glass-badge";
import { GlassButton } from "@/registry/liquid-glass/glass-button";
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "@/registry/liquid-glass/glass-card";
import { GlassInput } from "@/registry/liquid-glass/glass-input";
import { GlassSwitch } from "@/registry/liquid-glass/glass-switch";
import { CurrentWeatherWidget } from "@/registry/widgets/weather-widget";
import { catalogCounts, blocks, layouts } from "@/lib/catalog";
import { SAMPLE_OUTPUT, SAMPLE_PROFILE } from "@/lib/samples";
import { cn } from "@/lib/utils";

function CtaPair({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Link
        href="/templates"
        className={cn(
          buttonVariants({ size: "lg" }),
          inverted && "bg-deep-foreground text-deep hover:bg-deep-foreground/90",
        )}
      >
        Explore Templates
        <ArrowRight aria-hidden="true" />
      </Link>
      <Link
        href="/ai"
        className={cn(
          buttonVariants({ size: "lg", variant: "outline" }),
          inverted && "border-deep-border bg-transparent text-deep-foreground hover:bg-white/10 hover:text-deep-foreground",
        )}
      >
        Open AI Studio
      </Link>
    </div>
  );
}

const sectionPad = "px-4 py-20 sm:px-6 lg:px-8 lg:py-28";

const steps = {
  templates: [
    { title: "Choose", body: "Browse components, widgets, blocks and layouts. Each one has a live preview." },
    { title: "Customize", body: "Change props, Tailwind classes and tokens. The code is yours, so nothing is locked away." },
    { title: "Use", body: "Add it with one shadcn CLI command and it lands in your project as ordinary source files." },
  ],
  ai: [
    { title: "Describe yourself", body: "Name, role, skills, experience. Everything is optional except having something to say." },
    { title: "Choose platform and tone", body: "Instagram, LinkedIn, X or Telegram. Professional, friendly, creative or humorous. Short, medium or long." },
    { title: "Generate", body: "The server builds a structured prompt for that platform and asks the model for one clean draft." },
    { title: "Edit", body: "Change any word. The character count and the platform preview update as you type." },
    { title: "Copy", body: "Copy the text and paste it where it belongs." },
  ],
};

const benefits = [
  ["Reusable UI", "Components, widgets and page flows are built once, documented once, and reused across projects."],
  ["Faster development", "Start from ready-made blocks such as sign-in, pricing and an admin layout instead of a blank file."],
  ["Consistent design", "Everything shares tokens for colour, radius and spacing, so pieces still look related when combined."],
  ["Content for the right platform", "A LinkedIn About section and an X bio are different jobs. AI Studio writes for the one you pick."],
  ["Output you can edit", "The result is plain text in an editable field. Nothing is locked, and nothing is posted for you."],
  ["A developer-friendly workflow", "TypeScript, Tailwind CSS, Radix primitives and the shadcn CLI. No new tooling to learn."],
] as const;

const useCases = [
  ["Developers", "Start a project from working components and page flows, install only what you need with the shadcn CLI, and own the code."],
  ["Students", "Build a portfolio or course project with a coherent interface, then write the bio that goes with it."],
  ["Designers", "See a visual direction as real, accessible components, and reuse the same tokens in your own work."],
  ["Indie hackers", "Get sign-in, sign-up, pricing and an admin panel in place early, so time goes to the product."],
  ["Portfolio builders", "Combine sections and blocks into a personal site, then write matching profile text for each network."],
  ["Creators", "Get a bio for Instagram, X or Telegram in a tone that sounds like you, edit it, and copy it."],
] as const;

export default function HomePage() {
  const c = catalogCounts;
  return (
    <>
      {/* ---------------- Hero ---------------- */}
<section className="relative overflow-hidden border-b border-border">
  {/* Subtle ambient background */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(60rem_28rem_at_75%_-10%,color-mix(in_oklab,var(--brand)_16%,transparent),transparent)]"
  />

  <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:px-8 lg:pb-28 lg:pt-20">

    {/* ================= LEFT: HERO CONTENT ================= */}
    <div className="hero-reveal max-w-xl">

      <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
        Build better interfaces.
        <br />
        Create better profiles.
      </h1>

      <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
        Templatos is a set of reusable interface templates you can use in
        your own project, together with an AI Studio that creates bios for
        Instagram, LinkedIn, X and Telegram from your own details.
      </p>

      {/* Primary actions */}
      <CtaPair className="mt-8" />

      {/* Library stats */}
      <p className="mt-6 max-w-lg text-sm leading-6 text-muted-foreground">
        {c.components} components, {c.widgets} widgets, {c.blocks} blocks
        and {c.layouts} layout, each with a live preview and code.
      </p>

    </div>

    {/* ================= RIGHT: LIVE PREVIEW ================= */}
    <div className="hero-reveal hero-reveal-2 relative">

      <ComponentStage
        size="tall"
        label="Live Templatos components"
        className="relative min-h-[30rem] overflow-hidden rounded-lg border-deep-border bg-deep"
      >

        {/* Preview area */}
        <div className="flex min-h-[30rem] w-full items-center justify-center p-5 sm:p-8">

          {/* Two cards side-by-side */}
          <div className="grid w-full max-w-2xl grid-cols-1 items-center gap-6 sm:grid-cols-2">

            {/* ================= WORKSPACE CARD ================= */}
            <GlassCard className="w-full">

              <GlassCardHeader>
                <div className="flex items-center justify-between gap-2">

                  <GlassCardTitle>
                    Workspace settings
                  </GlassCardTitle>

                  <GlassBadge
                    variant="success"
                    size="sm"
                  >
                    Saved
                  </GlassBadge>

                </div>

                <GlassCardDescription>
                  Components from the library, rendered live.
                </GlassCardDescription>
              </GlassCardHeader>

              <GlassCardContent className="space-y-4">

                <GlassInput
                  aria-label="Workspace name"
                  defaultValue="Atlas"
                />

                <div className="flex items-center justify-between gap-3 text-sm text-white/80">

                  <span id="hero-switch-label">
                    Email notifications
                  </span>

                  <GlassSwitch
                    defaultChecked
                    aria-labelledby="hero-switch-label"
                  />

                </div>

                <GlassButton
                  variant="primary"
                  className="w-full"
                >
                  Save changes
                </GlassButton>

              </GlassCardContent>

            </GlassCard>

            {/* ================= MAYA / PROFILE CARD ================= */}
            <div className="w-full">

              <PlatformPreview
                platform="instagram"
                text={SAMPLE_OUTPUT.instagram.friendly}
                name={SAMPLE_PROFILE.name}
                website={SAMPLE_PROFILE.website}
              />

            </div>

          </div>

        </div>

      </ComponentStage>

    </div>

  </div>
</section>

      {/* ---------------- What is Templatos ---------------- */}
      <section className={cn("mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16", sectionPad)}>
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">What Templatos is</h2>
        <div className="max-w-2xl space-y-5 text-base leading-7 text-muted-foreground">
          <p>
            Most projects begin the same way: a blank file, a login screen to rebuild, a settings page to restyle. Most
            profiles begin the same way too: a text box and no idea how long a LinkedIn About section should be compared with
            an X bio.
          </p>
          <p>
            Templatos puts an answer to both in one place. The <strong className="font-medium text-foreground">Templates</strong> side
            is a library of documented, accessible building blocks you install into your own codebase. The{" "}
            <strong className="font-medium text-foreground">AI Studio</strong> side takes what you tell it about yourself and writes
            text sized and styled for the platform you choose.
          </p>
          <p>They share one design system, so the site you build and the profile you write can look like they came from the same person.</p>
        </div>
      </section>

      {/* ---------------- Two ways ---------------- */}
      <section className="border-y border-border bg-sunken" aria-labelledby="two-ways">
        <div className={cn("mx-auto max-w-7xl", sectionPad)}>
          <h2 id="two-ways" className="max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Two ways to use Templatos
          </h2>
          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-0">
            <article className="lg:pr-14">
              <p className="font-mono text-sm text-muted-foreground">01</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Templates</h3>
              <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
                Build interfaces faster with reusable pieces that already work, are documented, and become part of your code.
              </p>
              <ul className="mt-5 space-y-1.5 text-sm">
                {[
                  `Components: ${c.components} inputs, dialogs, tabs, tables and more`,
                  `Widgets: ${c.widgets} for weather, stocks, time, calendar and stats`,
                  `Blocks: ${c.blocks} page flows such as sign-in and pricing`,
                  `Layouts: ${c.layouts} dashboard layout with navigation`,
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
              <ComponentStage size="compact" label="Live button and badge components" className="mt-7 rounded-lg border-deep-border bg-deep">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <GlassButton variant="primary">Primary</GlassButton>
                  <GlassButton variant="outline">Outline</GlassButton>
                  <GlassBadge variant="primary">New</GlassBadge>
                  <GlassBadge variant="success">Active</GlassBadge>
                </div>
              </ComponentStage>
              <Link href="/templates" className={cn(buttonVariants({ size: "lg" }), "mt-7")}>
                Explore Templates
                <ArrowRight aria-hidden="true" />
              </Link>
            </article>

            <article className="border-border lg:border-l lg:pl-14">
              <p className="font-mono text-sm text-muted-foreground">02</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">AI Studio</h3>
              <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
                Create professional profile and social content from your details, the platform you&apos;re writing for, and the tone you want.
              </p>
              <ul className="mt-5 space-y-1.5 text-sm">
                {[
                  "Instagram, LinkedIn, X / Twitter and Telegram",
                  "Professional, friendly, creative or humorous",
                  "Short, medium or long, within each platform's limit",
                  "Editable result with a live character count and preview",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 max-w-sm">
                <PlatformPreview platform="x" text={SAMPLE_OUTPUT.x.professional} name={SAMPLE_PROFILE.name} website={SAMPLE_PROFILE.website} />
              </div>
              <Link href="/ai" className={cn(buttonVariants({ size: "lg" }), "mt-7")}>
                Open AI Studio
                <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className={cn("mx-auto max-w-7xl", sectionPad)} aria-labelledby="how">
        <h2 id="how" className="max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          How it works
        </h2>
        <div className="mt-12 space-y-16">
          {(
            [
              ["Templates", steps.templates],
              ["AI Studio", steps.ai],
            ] as const
          ).map(([name, list]) => (
            <div key={name}>
              <h3 className="text-lg font-semibold">{name}</h3>
              <ol className={cn("mt-5 grid gap-x-8 gap-y-6 border-t border-border pt-6 sm:grid-cols-2", list.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-5")}>
                {list.map((step, index) => (
                  <li key={step.title}>
                    <span className="flex size-6 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-accent-foreground">{index + 1}</span>
                    <p className="mt-3 font-medium">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.body}</p>
                  </li>
                ))}
              </ol>
              {name === "Templates" ? (
                <pre className="mt-6 overflow-x-auto rounded-md bg-deep p-4 font-mono text-sm text-deep-foreground">
                  <code>npx shadcn@latest add @templatos/glass-button</code>
                </pre>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Templates ecosystem ---------------- */}
      <section className="border-y border-border bg-sunken" aria-labelledby="ecosystem">
        <div className={cn("mx-auto max-w-7xl", sectionPad)}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <h2 id="ecosystem" className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              What&apos;s in Templates
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Four kinds of building block, from small controls to whole screens. Everything listed here is implemented, previewed and documented.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-semibold">Components</h3>
                <Link href="/components" className="text-sm font-medium text-brand underline-offset-4 hover:underline">
                  All {c.components}
                </Link>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Buttons, inputs, dialogs, tabs, tables and other controls, built on Radix primitives.</p>
              <ComponentStage size="default" label="Live component examples" className="mt-4 rounded-lg border-deep-border bg-deep">
                <div className="flex w-full max-w-xs flex-col gap-3">
                  <GlassInput aria-label="Email" placeholder="you@example.com" />
                  <div className="flex gap-2">
                    <GlassButton variant="primary" className="flex-1">Continue</GlassButton>
                    <GlassButton variant="outline">Cancel</GlassButton>
                  </div>
                </div>
              </ComponentStage>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-semibold">Widgets</h3>
                <Link href="/widgets" className="text-sm font-medium text-brand underline-offset-4 hover:underline">
                  All {c.widgets}
                </Link>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Self-contained pieces for dashboards: weather, clocks, calendar, stocks and stats.</p>
              <ComponentStage size="default" label="Live weather widget" className="mt-4 rounded-lg border-deep-border bg-deep">
                <CurrentWeatherWidget location="San Francisco" temperature={18} feelsLike={16} high={22} low={14} condition="cloudy" humidity={68} windSpeed={15} />
              </ComponentStage>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-semibold">Blocks</h3>
                <Link href="/blocks" className="text-sm font-medium text-brand underline-offset-4 hover:underline">
                  All {c.blocks}
                </Link>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Complete page flows with validation and states already handled.</p>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {blocks.map((block) => (
                  <li key={block.id}>
                    <Link href={block.href} className="flex items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-brand">
                      <span className="font-medium">{block.title}</span>
                      <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-semibold">Layouts</h3>
                <Link href="/templates?kind=layout" className="text-sm font-medium text-brand underline-offset-4 hover:underline">
                  View
                </Link>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Page structure with navigation, for when a single block isn&apos;t enough.</p>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {layouts.map((layout) => (
                  <li key={layout.id}>
                    <Link href={layout.href} className="flex items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-brand">
                      <span>
                        <span className="font-medium">{layout.title}</span>
                        <span className="mt-0.5 block text-muted-foreground">{layout.description}</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- AI Studio preview ---------------- */}
      <section className="bg-[color-mix(in_oklab,var(--brand-soft)_40%,var(--background))]" aria-labelledby="studio-preview">
        <div className={cn("mx-auto max-w-7xl", sectionPad)}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <h2 id="studio-preview" className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Try the output side of AI Studio
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Switch platform and tone to see how the same person reads on each network. This preview uses pre-written sample text;
              AI Studio generates new text from your details.
            </p>
          </div>
          <div className="mt-12">
            <MiniStudio />
          </div>
        </div>
      </section>

      {/* ---------------- Why ---------------- */}
      <section className="bg-deep text-deep-foreground" aria-labelledby="why">
        <div className={cn("mx-auto max-w-7xl", sectionPad)}>
          <h2 id="why" className="max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Why Templatos
          </h2>
          <dl className="mt-12 grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(([title, body]) => (
              <div key={title} className="border-t border-deep-border pt-5">
                <dt className="font-medium">{title}</dt>
                <dd className="mt-2 text-sm leading-6 text-deep-muted">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Use cases ---------------- */}
      <section className={cn("mx-auto max-w-7xl", sectionPad)} aria-labelledby="use-cases">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <h2 id="use-cases" className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Who it&apos;s for
          </h2>
          <dl className="divide-y divide-border border-y border-border">
            {useCases.map(([role, body]) => (
              <div key={role} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="font-medium">{role}</dt>
                <dd className="text-sm leading-6 text-muted-foreground">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="bg-deep text-deep-foreground" aria-labelledby="cta">
        <div className={cn("mx-auto max-w-7xl", "px-4 py-20 sm:px-6 lg:px-8 lg:py-24")}>
          <h2 id="cta" className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Start building with Templatos.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-deep-muted">
            Pick a component and add it to your project, or write your first bio. Both take a few minutes.
          </p>
          <CtaPair className="mt-8" inverted />
        </div>
      </section>
    </>
  );
}
