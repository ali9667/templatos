import type { AiErrorCode } from "./config";

/** Messages are written for end users. They never contain keys, stack traces or provider internals. */
export const USER_MESSAGES: Record<AiErrorCode, string> = {
  invalid_input: "Some of the details couldn't be used. Check the highlighted fields and try again.",
  not_configured:
    "AI generation isn't set up on this server yet. The site owner needs to add an OpenRouter API key (OPENROUTER_API_KEY).",
  invalid_key: "The AI provider rejected this server's API key. The site owner needs to check OPENROUTER_API_KEY.",
  rate_limited: "Too many requests right now. Wait a moment, then try again.",
  timeout: "The AI provider took too long to respond. Try again in a moment.",
  provider_unavailable: "The AI provider is unavailable at the moment. Try again shortly.",
  empty_response: "The AI provider returned an empty answer. Try generating again.",
  malformed_response: "The AI provider returned something we couldn't use. Try generating again.",
  network: "We couldn't reach the AI provider. Check your connection and try again.",
  unknown: "Something went wrong while generating. Try again.",
};

const RETRYABLE: Record<AiErrorCode, boolean> = {
  invalid_input: false,
  not_configured: false,
  invalid_key: false,
  rate_limited: true,
  timeout: true,
  provider_unavailable: true,
  empty_response: true,
  malformed_response: true,
  network: true,
  unknown: true,
};

export const STATUS_FOR_CODE: Record<AiErrorCode, number> = {
  invalid_input: 400,
  not_configured: 503,
  invalid_key: 502,
  rate_limited: 429,
  timeout: 504,
  provider_unavailable: 503,
  empty_response: 502,
  malformed_response: 502,
  network: 502,
  unknown: 500,
};

export class AiError extends Error {
  readonly code: AiErrorCode;
  readonly retryable: boolean;

  constructor(code: AiErrorCode, internalDetail?: string) {
    // The message is the safe, user-facing text. Internal detail is logged separately.
    super(USER_MESSAGES[code]);
    this.name = "AiError";
    this.code = code;
    this.retryable = RETRYABLE[code];
    this.internalDetail = internalDetail;
  }

  /** For server logs only. Never sent to the client. */
  readonly internalDetail?: string;
}
