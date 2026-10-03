import { PLATFORMS } from "./config";
import type { ParsedGenerateRequest } from "./schema";
import { AiError } from "./errors";
import { chatCompletion } from "./openrouter";
import { cleanModelOutput } from "./output";
import { buildMessages } from "./prompt";

export const DEFAULT_MODEL = "openrouter/free";

export interface GenerateResult {
  text: string;
  truncated: boolean;
  model: string;
  limit: number;
}

export interface GenerateDeps {
  fetchImpl?: typeof fetch;
  env?: Record<string, string | undefined>;
}

/** Server-only. Reads the API key from the environment and never returns it. */
export async function generateProfile(request: ParsedGenerateRequest, deps: GenerateDeps = {}): Promise<GenerateResult> {
  const env = deps.env ?? process.env;
  const apiKey = env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) throw new AiError("not_configured", "OPENROUTER_API_KEY is not set");

  const model = env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL;
  const messages = buildMessages(request);

  const raw = await chatCompletion({
    apiKey,
    model,
    messages,
    fetchImpl: deps.fetchImpl,
    referer: env.OPENROUTER_HTTP_REFERER?.trim() || env.NEXT_PUBLIC_SITE_URL?.trim() || undefined,
    title: env.OPENROUTER_APP_NAME?.trim() || "Templatos AI Studio",
  });

  const cleaned = cleanModelOutput(raw, request.platform, request.length);
  return { ...cleaned, model, limit: PLATFORMS[request.platform].maxChars };
}
