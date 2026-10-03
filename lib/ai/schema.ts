import { z } from "zod";
import { FIELD_LIMITS, LENGTH_IDS, PLATFORM_IDS, TONE_IDS, hasProfileContent, type ProfileInput } from "./config";

// Strip control characters (keeping tab and newline) and normalise line endings.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function cleanText(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function field(max: number, label: string) {
  return z
    .string()
    .max(max, `${label} can be up to ${max} characters.`)
    .default("")
    .transform(cleanText);
}

const website = z
  .string()
  .max(FIELD_LIMITS.website, `Website can be up to ${FIELD_LIMITS.website} characters.`)
  .default("")
  .transform((value) => cleanText(value).replace(/\s+/g, ""))
  .refine((value) => value === "" || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#][^\s]*)?$/i.test(value), {
    message: "Enter a website like example.com or https://example.com.",
  });

const profileSchema = z.object({
  name: field(FIELD_LIMITS.name, "Name"),
  role: field(FIELD_LIMITS.role, "Role"),
  skills: field(FIELD_LIMITS.skills, "Skills"),
  about: field(FIELD_LIMITS.about, "About"),
  experience: field(FIELD_LIMITS.experience, "Experience"),
  interests: field(FIELD_LIMITS.interests, "Interests"),
  website,
  instructions: field(FIELD_LIMITS.instructions, "Custom instructions"),
});

export const generateRequestSchema = z.object({
  profile: profileSchema,
  platform: z.enum(PLATFORM_IDS, { message: "Choose a platform." }),
  tone: z.enum(TONE_IDS, { message: "Choose a tone." }),
  length: z.enum(LENGTH_IDS, { message: "Choose a length." }),
});

export type ParsedGenerateRequest = z.infer<typeof generateRequestSchema>;

export function profileHasContent(profile: ProfileInput): boolean {
  return hasProfileContent(profile);
}
