import { describe, expect, it, vi } from "vitest";
import { generateProfile } from "@/lib/ai/generate";
import { AiError } from "@/lib/ai/errors";
import { EMPTY_PROFILE } from "@/lib/ai/config";

const request = {
  profile: { ...EMPTY_PROFILE, about: "I build web interfaces." },
  platform: "x" as const,
  tone: "professional" as const,
  length: "short" as const,
};

describe("generateProfile", () => {
  it("throws not_configured when the API key is missing", async () => {
    await expect(generateProfile(request, { env: {} })).rejects.toMatchObject({ code: "not_configured" });
  });

  it("returns cleaned text and the platform limit on success", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: "Frontend developer." } }] }), { status: 200 }),
    );
    const result = await generateProfile(request, { env: { OPENROUTER_API_KEY: "key" }, fetchImpl });
    expect(result.text).toBe("Frontend developer.");
    expect(result.limit).toBe(160);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("surfaces an AiError with a safe code on an upstream failure, never the key", async () => {
    const fetchImpl = vi.fn(async () => new Response("unauthorized", { status: 401 }));
    try {
      await generateProfile(request, { env: { OPENROUTER_API_KEY: "super-secret" }, fetchImpl });
      throw new Error("expected generateProfile to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(AiError);
      const aiError = error as AiError;
      expect(aiError.code).toBe("invalid_key");
      expect(aiError.message).not.toContain("super-secret");
    }
  });
});
