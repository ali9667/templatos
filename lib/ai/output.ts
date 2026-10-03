import { PLATFORMS, type LengthId, type PlatformId } from "./config";
import { AiError } from "./errors";

export interface CleanedOutput {
  text: string;
  truncated: boolean;
}

const PREFACE = /^(here(?:'s| is)[^\n:]*:|sure[,!.:][^\n]*\n|certainly[,!.:][^\n]*\n|(?:instagram|linkedin|x|twitter|telegram)\s+(?:bio|about|profile|description)\s*:)\s*/i;

/** Remove the things chat models like to wrap around an answer. */
function stripWrappers(raw: string): string {
  let text = raw.trim();

  // ```fenced``` output
  const fenced = text.match(/^```[a-z]*\n([\s\S]*?)\n?```$/i);
  if (fenced) text = fenced[1].trim();

  text = text.replace(PREFACE, "").trim();

  // Surrounding quotes
  text = text.replace(/^["“”'‘’]+([\s\S]*?)["“”'‘’]+$/, "$1").trim();

  // Markdown emphasis and headings
  text = text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|\s)\*([^*\n]+)\*(?=\s|$)/g, "$1$2")
    .replace(/__([^_]+)__/g, "$1");

  return text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function looksLikeJson(text: string): boolean {
  if (!/^[{[]/.test(text) || !/[}\]]$/.test(text)) return false;
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

function shorten(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const slice = text.slice(0, limit);
  // Prefer ending on a sentence, then on a word.
  const sentenceEnd = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "), slice.lastIndexOf("\n"));
  if (sentenceEnd > limit * 0.6) return slice.slice(0, sentenceEnd + 1).trim();
  const wordEnd = slice.lastIndexOf(" ");
  return (wordEnd > limit * 0.6 ? slice.slice(0, wordEnd) : slice).replace(/[,;:\s-]+$/, "").trim();
}

/**
 * Validates and normalises what the model returned. Throws an AiError rather than
 * returning something we can't stand behind.
 */
export function cleanModelOutput(raw: string, platform: PlatformId, _length: LengthId): CleanedOutput {
  void _length;
  const text = stripWrappers(raw);

  if (!text) throw new AiError("empty_response", "empty after cleaning");
  if (looksLikeJson(text)) throw new AiError("malformed_response", "model returned JSON");
  if (text.length < 8) throw new AiError("malformed_response", "output too short");
  if (/^(i can(?:not|'t)|i'm sorry|sorry,|as an ai)/i.test(text)) throw new AiError("malformed_response", "model refused");

  const limit = PLATFORMS[platform].maxChars;
  if (text.length > limit) {
    return { text: shorten(text, limit), truncated: true };
  }
  return { text, truncated: false };
}
