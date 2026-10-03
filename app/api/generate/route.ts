import { NextResponse } from "next/server";
import type { GenerateFailure, GenerateSuccess, AiErrorCode } from "@/lib/ai/config";
import { AiError, STATUS_FOR_CODE, USER_MESSAGES } from "@/lib/ai/errors";
import { generateProfile } from "@/lib/ai/generate";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { generateRequestSchema, profileHasContent } from "@/lib/ai/schema";
import type { ProfileField } from "@/lib/ai/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_BODY_BYTES = 16 * 1024;

function failure(code: AiErrorCode, extra?: { fields?: Partial<Record<ProfileField, string>>; headers?: HeadersInit }) {
  const body: GenerateFailure = {
    ok: false,
    error: {
      code,
      message: USER_MESSAGES[code],
      retryable: !["invalid_input", "not_configured", "invalid_key"].includes(code),
      ...(extra?.fields ? { fields: extra.fields } : {}),
    },
  };
  return NextResponse.json(body, {
    status: STATUS_FOR_CODE[code],
    headers: { "Cache-Control": "no-store", ...extra?.headers },
  });
}

export async function POST(request: Request) {
  // 1. Rate limit before doing any work.
  const limit = await checkRateLimit(request);
  if (!limit.allowed) {
    return failure("rate_limited", { headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  // 2. Read a bounded body and validate it.
  const raw = await request.text().catch(() => "");
  if (raw.length === 0 || raw.length > MAX_BODY_BYTES) return failure("invalid_input");

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return failure("invalid_input");
  }

  const parsed = generateRequestSchema.safeParse(json);
  if (!parsed.success) {
    const fields: Partial<Record<ProfileField, string>> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "profile" && typeof issue.path[1] === "string") {
        fields[issue.path[1] as ProfileField] ??= issue.message;
      }
    }
    return failure("invalid_input", { fields });
  }

  if (!profileHasContent(parsed.data.profile)) {
    return failure("invalid_input", {
      fields: { about: "Add at least a name, role, skills or a sentence about yourself." },
    });
  }

  // 3. Generate.
  try {
    const result = await generateProfile(parsed.data);
    const body: GenerateSuccess = {
      ok: true,
      text: result.text,
      platform: parsed.data.platform,
      tone: parsed.data.tone,
      length: parsed.data.length,
      limit: result.limit,
      truncated: result.truncated,
      model: result.model,
    };
    return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const aiError = error instanceof AiError ? error : new AiError("unknown", String(error));
    // Log the code and internal detail on the server only. Never the key, never the request body.
    console.error(`[ai-studio] generation failed code=${aiError.code} detail=${aiError.internalDetail ?? "-"}`);
    return failure(aiError.code);
  }
}
