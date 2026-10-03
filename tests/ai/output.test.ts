import { describe, expect, it } from "vitest";
import { cleanModelOutput } from "@/lib/ai/output";
import { AiError } from "@/lib/ai/errors";

describe("cleanModelOutput", () => {
  it("passes clean text through unchanged", () => {
    const result = cleanModelOutput("Frontend developer who builds accessible interfaces.", "x", "short");
    expect(result).toEqual({ text: "Frontend developer who builds accessible interfaces.", truncated: false });
  });

  it("strips a preface and surrounding quotes", () => {
    const result = cleanModelOutput('Here is your bio:\n"Frontend developer."', "x", "short");
    expect(result.text).toBe("Frontend developer.");
  });

  it("unwraps a markdown code fence", () => {
    const result = cleanModelOutput("```\nFrontend developer.\n```", "x", "short");
    expect(result.text).toBe("Frontend developer.");
  });

  it("shortens text over the platform limit and marks it truncated", () => {
    const long = `Frontend developer. ${"Building accessible interfaces. ".repeat(10)}`;
    const result = cleanModelOutput(long, "x", "long");
    expect(result.truncated).toBe(true);
    expect(result.text.length).toBeLessThanOrEqual(160);
  });

  it("throws malformed_response for JSON output", () => {
    expect(() => cleanModelOutput('{"bio": "hello"}', "x", "short")).toThrow(AiError);
  });

  it("throws malformed_response for a refusal", () => {
    expect(() => cleanModelOutput("I'm sorry, I can't help with that.", "x", "short")).toThrow(AiError);
  });

  it("throws empty_response for blank output", () => {
    expect(() => cleanModelOutput("   ", "x", "short")).toThrow(AiError);
  });
});
