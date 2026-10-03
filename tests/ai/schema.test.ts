import { describe, expect, it } from "vitest";
import { generateRequestSchema } from "@/lib/ai/schema";
import { EMPTY_PROFILE, FIELD_LIMITS } from "@/lib/ai/config";

const base = {
  profile: { ...EMPTY_PROFILE, about: "I build web interfaces." },
  platform: "linkedin",
  tone: "professional",
  length: "medium",
};

describe("generateRequestSchema", () => {
  it("accepts a minimal valid request", () => {
    const parsed = generateRequestSchema.safeParse(base);
    expect(parsed.success).toBe(true);
  });

  it("rejects an unknown platform", () => {
    const parsed = generateRequestSchema.safeParse({ ...base, platform: "facebook" });
    expect(parsed.success).toBe(false);
  });

  it("rejects an unknown tone", () => {
    const parsed = generateRequestSchema.safeParse({ ...base, tone: "sarcastic" });
    expect(parsed.success).toBe(false);
  });

  it("rejects a field over its character limit", () => {
    const parsed = generateRequestSchema.safeParse({
      ...base,
      profile: { ...base.profile, about: "a".repeat(FIELD_LIMITS.about + 1) },
    });
    expect(parsed.success).toBe(false);
  });

  it("strips control characters and collapses whitespace", () => {
    const parsed = generateRequestSchema.safeParse({
      ...base,
      profile: { ...base.profile, name: "Maya\u0000  Rivera" },
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.profile.name).toBe("Maya Rivera");
  });

  it("rejects a malformed website", () => {
    const parsed = generateRequestSchema.safeParse({ ...base, profile: { ...base.profile, website: "not a url" } });
    expect(parsed.success).toBe(false);
  });

  it("accepts a bare domain for website", () => {
    const parsed = generateRequestSchema.safeParse({ ...base, profile: { ...base.profile, website: "example.com" } });
    expect(parsed.success).toBe(true);
  });
});
