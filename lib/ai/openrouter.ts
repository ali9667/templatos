import { AiError } from "./errors";
import type { ChatMessage } from "./prompt";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export interface OpenRouterOptions {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  /** Total time allowed for the whole call, including the single retry. */
  timeoutMs?: number;
  referer?: string;
  title?: string;
  /** Injectable for tests. */
  fetchImpl?: typeof fetch;
  maxTokens?: number;
}

interface OpenRouterBody {
  error?: { code?: number | string; message?: string };
  choices?: Array<{
    message?: { content?: unknown };
    finish_reason?: string;
  }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Content is normally a string, but some models return an array of text parts. */
function extractText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (isRecord(part) && typeof part.text === "string" ? part.text : ""))
      .join("");
  }
  return "";
}

function codeFromStatus(status: number): AiError {
  if (status === 401 || status === 403) return new AiError("invalid_key", `provider status ${status}`);
  if (status === 402) return new AiError("provider_unavailable", "provider status 402 (credits)");
  if (status === 408 || status === 504) return new AiError("timeout", `provider status ${status}`);
  if (status === 429) return new AiError("rate_limited", "provider status 429");
  if (status >= 500) return new AiError("provider_unavailable", `provider status ${status}`);
  return new AiError("unknown", `provider status ${status}`);
}

async function attempt(options: OpenRouterOptions, signal: AbortSignal): Promise<string> {
  const doFetch = options.fetchImpl ?? fetch;

  let response: Response;
  try {
    response = await doFetch(ENDPOINT, {
      method: "POST",
      signal,
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
        ...(options.referer ? { "HTTP-Referer": options.referer } : {}),
        ...(options.title ? { "X-Title": options.title } : {}),
      },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        temperature: 0.8,
        max_tokens: options.maxTokens ?? 900,
        stream: false,
      }),
    });
  } catch (error) {
    if (signal.aborted || (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError"))) {
      throw new AiError("timeout", "request aborted by deadline");
    }
    throw new AiError("network", error instanceof Error ? error.message : "fetch failed");
  }

  if (!response.ok) throw codeFromStatus(response.status);

  let body: OpenRouterBody;
  try {
    body = (await response.json()) as OpenRouterBody;
  } catch {
    throw new AiError("malformed_response", "response was not JSON");
  }

  // OpenRouter can answer HTTP 200 with an error object in the body.
  if (body.error) {
    const code = Number(body.error.code);
    throw Number.isFinite(code) && code >= 400 ? codeFromStatus(code) : new AiError("provider_unavailable", "error object in body");
  }

  if (!Array.isArray(body.choices) || body.choices.length === 0) {
    throw new AiError("malformed_response", "no choices in response");
  }

  const text = extractText(body.choices[0]?.message?.content).trim();
  if (!text) throw new AiError("empty_response", `finish_reason=${body.choices[0]?.finish_reason ?? "unknown"}`);
  return text;
}

/**
 * One request, with a single quick retry for transient provider failures.
 * The whole call is bounded by `timeoutMs`; nothing here retries indefinitely.
 */
export async function chatCompletion(options: OpenRouterOptions): Promise<string> {
  const deadline = AbortSignal.timeout(options.timeoutMs ?? 25_000);
  const maxAttempts = 2;
  let lastError: AiError = new AiError("unknown");

  for (let attemptNumber = 1; attemptNumber <= maxAttempts; attemptNumber += 1) {
    try {
      return await attempt(options, deadline);
    } catch (error) {
      lastError = error instanceof AiError ? error : new AiError("unknown", String(error));
      const transient = lastError.code === "provider_unavailable" || lastError.code === "empty_response";
      if (!transient || attemptNumber === maxAttempts || deadline.aborted) break;
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }
  throw lastError;
}
