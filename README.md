# Templatos

Templatos is a toolkit for building polished web interfaces and writing profile content, in one Next.js app.

It has two parts:

- **Templates** — a library of components, widgets, blocks and layouts you copy into your own project with a single `shadcn` CLI command. You own the code afterwards.
- **AI Studio** — a workspace that writes a bio or About section for Instagram, LinkedIn, X or Telegram from the details you give it, in a tone and length you choose. The result is editable before you copy it.

Live product sections: `/templates`, `/components`, `/widgets`, `/blocks`, `/ai`, `/docs`.

## Why it exists

Two unrelated problems come up constantly when putting something on the web: you need interface pieces that already work and look considered, and you need to describe yourself in a way that fits the platform you're posting to. Most tools solve one or the other. Templatos solves both from one design system, so the site you build and the bio you write don't look like they came from two different places.

## Templates

Four kinds of building block, every one of them a real, documented, previewable implementation — nothing on `/templates` is a placeholder card:

| Kind | What it is | Where |
|---|---|---|
| Components | Buttons, inputs, dialogs, tabs, tables and other controls built on Radix UI primitives | `registry/liquid-glass/` |
| Widgets | Self-contained dashboard pieces: weather, clock, calendar, stocks, stats | `registry/widgets/` |
| Blocks | Full page flows with validation and state handling: sign in, sign up, forgot password, pricing | `registry/blocks/` |
| Layouts | Page structure with navigation, for dashboards | `registry/blocks/admin/` |

Each item has a live preview, a documentation page at `/docs/components/<slug>`, and installs into your own project with:

```bash
npx shadcn@latest add @templatos/<component-name>
```

The CLI copies the component's source files into your project — it is not an npm runtime dependency, so once it's installed it's yours to change.

## AI Studio

AI Studio (`/ai`) is a complete, working generation flow, not a static form:

1. **Profile** — name, role, skills, about, experience, interests, website, and optional custom instructions. Every field is optional except having something to say.
2. **Platform** — Instagram, LinkedIn, X / Twitter or Telegram. Each has its own character limit and voice.
3. **Style** — a tone (professional, friendly, creative, humorous) and a length (short, medium, long).
4. **Generate** — the server builds a structured prompt describing the platform, tone, length and profile, and sends it to an LLM through OpenRouter.
5. **Result** — the generated text is editable, shows a live character count against the platform's limit, and can be copied, regenerated or reset. A platform-accurate preview shows roughly how it will look.

### How generation works

- `app/api/generate/route.ts` is the only place that talks to the AI provider. The API key never reaches the browser.
- `lib/ai/schema.ts` validates and sanitizes every field with Zod before anything is sent to a model (length limits, control-character stripping, a loose URL check on the website field).
- `lib/ai/prompt.ts` builds a single structured prompt from the platform, tone, length and profile — not a generic "write a bio" instruction — and explicitly tells the model to treat the profile data as source material, not instructions.
- `lib/ai/openrouter.ts` calls OpenRouter's `/chat/completions` endpoint with a bounded timeout and a single retry for transient failures. It never retries indefinitely.
- `lib/ai/output.ts` strips wrappers a chat model tends to add (code fences, "Here's your bio:", surrounding quotes, markdown emphasis), rejects JSON or refusal-shaped output, and shortens text that runs over the platform's limit.
- `lib/ai/rate-limit.ts` rate-limits by IP — Upstash Redis if configured, an in-memory fallback otherwise.
- Errors are mapped to a small set of user-facing messages (`lib/ai/errors.ts`) that never include a key, a stack trace, or raw provider output. The client (`components/ai-studio/use-generation.ts`) handles empty, loading, success, error and retry states, with its own timeout so the UI can never get stuck on "loading," and ignores a second submit while one request is already running.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) and [React 19](https://react.dev)
- TypeScript, [Tailwind CSS 4](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com) primitives, [shadcn](https://ui.shadcn.com)-compatible component registry
- [Zod](https://zod.dev) for request validation
- [Vitest](https://vitest.dev) and Testing Library for tests
- [Upstash Redis](https://upstash.com) for distributed rate limiting (optional)
- [next-themes](https://github.com/pacocoursey/next-themes) for the single light/dark theme provider
- [Geist](https://vercel.com/font) (sans and mono)

## Installation

Requires Node.js 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
cp .env.example .env.local   # then fill in OPENROUTER_API_KEY to use AI Studio
pnpm dev
```

The app runs at `http://localhost:3000`. Templates, Components, Widgets, Blocks and Docs all work with no environment variables set. AI Studio works too — without a key it responds with a clear "AI generation isn't set up on this server yet" error instead of pretending to generate something.

## Environment variables

See [`.env.example`](./.env.example) for the full, current list with explanations. In short:

| Variable | Required | Purpose |
|---|---|---|
| `OPENROUTER_API_KEY` | For AI Studio | Server-side OpenRouter key. Never sent to the browser. |
| `OPENROUTER_MODEL` | No | Defaults to `openrouter/free`. |
| `OPENROUTER_HTTP_REFERER`, `OPENROUTER_APP_NAME` | No | Sent as OpenRouter's attribution headers. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | No | Shared rate limiting across serverless instances. Falls back to an in-memory limiter if unset. |
| `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_MAX` | No | Defaults: 60-second window, 8 requests per IP. |
| `NEXT_PUBLIC_SITE_URL` | In production | Canonical URL used in metadata, the sitemap, `robots.txt` and the registry URLs. Falls back to `http://localhost:3000` locally. |

## Development

```bash
pnpm dev             # start the dev server
pnpm lint             # eslint
pnpm test             # vitest, single run
pnpm test:watch       # vitest, watch mode
pnpm test:coverage    # vitest with coverage
```

## Testing

Tests live under `tests/` and cover both the component library and the AI Studio request/response logic: input validation (`tests/ai/schema.test.ts`), prompt construction (`tests/ai/prompt.test.ts`), output cleaning (`tests/ai/output.test.ts`), and the end-to-end `generateProfile` flow against a mocked `fetch`, including that a provider error never leaks the API key (`tests/ai/generate.test.ts`).

## Build

```bash
pnpm build
pnpm start
```

`pnpm build` runs a full TypeScript check and statically generates every route that doesn't need request-time data (components, widgets, docs). `/`, `/templates`, `/components`, `/widgets`, `/blocks` and `/docs/*` are static; `/api/generate` and `/llms.txt` are server-rendered on demand.

## Deployment

Deploys cleanly to [Vercel](https://vercel.com) or any Node.js host that supports the Next.js App Router:

1. Set `OPENROUTER_API_KEY` (and optionally the Upstash and site-URL variables above) in your hosting provider's environment settings — never commit them.
2. Build with `pnpm build`, run with `pnpm start`.
3. Set `NEXT_PUBLIC_SITE_URL` to your real domain so metadata and the sitemap aren't left pointing at `localhost`.

## Project structure

```
app/                    Routes (App Router)
  ai/                    AI Studio page
  api/generate/          The only route that calls the AI provider
  templates/ components/ widgets/ blocks/   Catalog pages
  docs/                  Documentation
components/
  shell/                  Navbar, footer, logo, theme toggle — the single app shell
  ai-studio/              AI Studio UI and its generation hook
  templates/              The shared catalog browser used by /templates, /components, /widgets, /blocks
  docs/                   Documentation page components
lib/
  ai/                     Prompt, OpenRouter client, validation, error model, rate limiting
  catalog.ts              Derives the Templates catalog from the real component registry
  site.ts                 Site name, URL and navigation — single source of truth
  docs/                   Component registry and documentation content
registry/                 The actual component, widget and block source files
```

## License

MIT — see [`LICENSE`](./LICENSE). Portions of this project build on earlier open-source work; see [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md) for the original license text.

---

Built by [Ali](https://github.com/ali9667).
