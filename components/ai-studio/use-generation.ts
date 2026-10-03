"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GenerateFailure, GenerateRequest, GenerateResponse, GenerateSuccess } from "@/lib/ai/config";

export type GenerationStatus = "idle" | "loading" | "success" | "error";

export interface GenerationState {
  status: GenerationStatus;
  result: GenerateSuccess | null;
  error: GenerateFailure["error"] | null;
}

const CLIENT_TIMEOUT_MS = 35_000;

function failure(code: GenerateFailure["error"]["code"], message: string, retryable = true): GenerateFailure["error"] {
  return { code, message, retryable };
}

function isResponse(value: unknown): value is GenerateResponse {
  return typeof value === "object" && value !== null && typeof (value as { ok?: unknown }).ok === "boolean";
}

/**
 * Owns one generation at a time. A second call while one is running is ignored,
 * unmounting cancels the request, and a client-side timeout guarantees the UI
 * can never stay stuck on "loading".
 */
export function useGeneration() {
  const [state, setState] = useState<GenerationState>({ status: "idle", result: null, error: null });
  const inflight = useRef<AbortController | null>(null);

  useEffect(() => () => inflight.current?.abort(), []);

  const generate = useCallback(async (request: GenerateRequest): Promise<GenerateSuccess | null> => {
    if (inflight.current) return null; // prevents accidental duplicate submissions

    const controller = new AbortController();
    inflight.current = controller;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, CLIENT_TIMEOUT_MS);

    setState((previous) => ({ status: "loading", result: previous.result, error: null }));

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!isResponse(payload)) {
        setState((previous) => ({
          status: "error",
          result: previous.result,
          error: failure("unknown", "The server sent an unexpected response. Try again."),
        }));
        return null;
      }

      if (payload.ok) {
        setState({ status: "success", result: payload, error: null });
        return payload;
      }

      setState((previous) => ({ status: "error", result: previous.result, error: payload.error }));
      return null;
    } catch (error) {
      const aborted = error instanceof DOMException && error.name === "AbortError";
      if (aborted && !timedOut) {
        // Cancelled by the user or by navigation: return to where we were.
        setState((previous) => ({ status: previous.result ? "success" : "idle", result: previous.result, error: null }));
        return null;
      }
      setState((previous) => ({
        status: "error",
        result: previous.result,
        error: timedOut
          ? failure("timeout", "This is taking longer than expected. Try again in a moment.")
          : failure("network", "We couldn't reach the server. Check your connection and try again."),
      }));
      return null;
    } finally {
      clearTimeout(timer);
      inflight.current = null;
    }
  }, []);

  const cancel = useCallback(() => inflight.current?.abort(), []);
  const restore = useCallback((result: GenerateSuccess) => {
    inflight.current?.abort();
    setState({ status: "success", result, error: null });
  }, []);
  const clear = useCallback(() => {
    inflight.current?.abort();
    setState({ status: "idle", result: null, error: null });
  }, []);

  return { state, generate, cancel, clear, restore };
}
