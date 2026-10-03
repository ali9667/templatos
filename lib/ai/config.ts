/**
 * Shared, dependency-free constants for AI Studio.
 * Imported by both the client UI and the server route, so keep it tiny.
 */

export const PLATFORM_IDS = ["instagram", "linkedin", "x", "telegram"] as const;
export type PlatformId = (typeof PLATFORM_IDS)[number];

export const TONE_IDS = ["professional", "friendly", "creative", "humorous"] as const;
export type ToneId = (typeof TONE_IDS)[number];

export const LENGTH_IDS = ["short", "medium", "long"] as const;
export type LengthId = (typeof LENGTH_IDS)[number];

export interface PlatformSpec {
  id: PlatformId;
  label: string;
  /** Hard limit enforced by the platform itself. */
  maxChars: number;
  /** Maximum characters the generator is asked to stay within, per length option. */
  targets: Record<LengthId, number>;
  /** Short note shown in the UI under the platform picker. */
  hint: string;
  /** Style direction given to the model. */
  guidance: string;
}

export const PLATFORMS: Record<PlatformId, PlatformSpec> = {
  instagram: {
    id: "instagram",
    label: "Instagram",
    maxChars: 150,
    targets: { short: 70, medium: 110, long: 150 },
    hint: "Bios hold 150 characters. Line breaks and a light touch of emoji work well.",
    guidance:
      "Instagram bio: short, personality-driven and easy to scan. Use line breaks to separate ideas. At most two emoji, and only if they suit the tone. No hashtags unless the user asked for them.",
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    maxChars: 2600,
    targets: { short: 300, medium: 700, long: 1500 },
    hint: "The About section holds 2,600 characters. Written in the first person.",
    guidance:
      "LinkedIn About section: professional, concise and career-oriented. First person. Open with what the person does and who it helps, then experience and strengths, and close with a simple invitation to connect or a way to get in touch. Short paragraphs, no emoji, no hashtags.",
  },
  x: {
    id: "x",
    label: "X / Twitter",
    maxChars: 160,
    targets: { short: 70, medium: 120, long: 160 },
    hint: "Bios hold 160 characters. Concise and distinctive reads best.",
    guidance:
      "X (Twitter) bio: concise and distinctive, with one clear point of view. Sentence fragments are fine. At most one emoji. No hashtag stuffing.",
  },
  telegram: {
    id: "telegram",
    label: "Telegram",
    maxChars: 255,
    targets: { short: 70, medium: 160, long: 250 },
    hint: "Profile bios hold 70 characters. Use Medium or Long for a channel or group description (255).",
    guidance:
      "Telegram bio or channel description: casual but informative. Say plainly who the person is and what they share or build. Light, conversational, no corporate phrasing.",
  },
};

export const PLATFORM_LIST = PLATFORM_IDS.map((id) => PLATFORMS[id]);

export interface ToneSpec {
  id: ToneId;
  label: string;
  description: string;
  guidance: string;
}

export const TONES: Record<ToneId, ToneSpec> = {
  professional: {
    id: "professional",
    label: "Professional",
    description: "Clear and credible",
    guidance: "Professional: clear, credible and measured. Confident without exaggeration.",
  },
  friendly: {
    id: "friendly",
    label: "Friendly",
    description: "Warm and approachable",
    guidance: "Friendly: warm, approachable and conversational, like introducing yourself to a new colleague.",
  },
  creative: {
    id: "creative",
    label: "Creative",
    description: "Distinctive and expressive",
    guidance: "Creative: distinctive and expressive, with a memorable turn of phrase, while staying easy to read.",
  },
  humorous: {
    id: "humorous",
    label: "Humorous",
    description: "Light and witty",
    guidance: "Humorous: light and witty, with one good joke at most. The person should still come across as capable.",
  },
};

export const TONE_LIST = TONE_IDS.map((id) => TONES[id]);

export const LENGTH_LABELS: Record<LengthId, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
};

/** Maximum lengths accepted for each profile field. Enforced on both client and server. */
export const FIELD_LIMITS = {
  name: 80,
  role: 120,
  skills: 300,
  about: 1200,
  experience: 1200,
  interests: 300,
  website: 200,
  instructions: 400,
} as const;

export type ProfileField = keyof typeof FIELD_LIMITS;

export interface ProfileInput {
  name: string;
  role: string;
  skills: string;
  about: string;
  experience: string;
  interests: string;
  website: string;
  instructions: string;
}

export const EMPTY_PROFILE: ProfileInput = {
  name: "",
  role: "",
  skills: "",
  about: "",
  experience: "",
  interests: "",
  website: "",
  instructions: "",
};

export interface GenerateRequest {
  profile: ProfileInput;
  platform: PlatformId;
  tone: ToneId;
  length: LengthId;
}

export type AiErrorCode =
  | "invalid_input"
  | "not_configured"
  | "invalid_key"
  | "rate_limited"
  | "timeout"
  | "provider_unavailable"
  | "empty_response"
  | "malformed_response"
  | "network"
  | "unknown";

export interface GenerateSuccess {
  ok: true;
  text: string;
  platform: PlatformId;
  tone: ToneId;
  length: LengthId;
  /** Hard platform limit, so the UI can show a character count. */
  limit: number;
  /** True when the model overshot the platform limit and the text was shortened. */
  truncated: boolean;
  model: string;
}

export interface GenerateFailure {
  ok: false;
  error: {
    code: AiErrorCode;
    message: string;
    retryable: boolean;
    /** Field-level messages for invalid_input. */
    fields?: Partial<Record<ProfileField, string>>;
  };
}

export type GenerateResponse = GenerateSuccess | GenerateFailure;

/** Fields that can carry the substance of a profile. At least one must be filled in. */
export const CONTENT_FIELDS: ProfileField[] = ["name", "role", "skills", "about", "experience", "interests"];

export function hasProfileContent(profile: ProfileInput): boolean {
  return CONTENT_FIELDS.some((field) => profile[field].trim().length >= 2);
}
