import { Redis } from "@upstash/redis";

/**
 * Fixed-window rate limit per client IP.
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are set (recommended for
 * serverless deployments, where memory is not shared). Falls back to an in-process map for local development.
 */

const WINDOW_SECONDS = Number.parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS ?? "60", 10) || 60;
const MAX_REQUESTS = Number.parseInt(process.env.RATE_LIMIT_MAX ?? "8", 10) || 8;

let redis: Redis | null = null;
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
if (url && token) redis = new Redis({ url, token });

const memory = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

function memoryLimit(key: string): RateLimitResult {
  const now = Date.now();
  // Lazy cleanup keeps the map small without a timer.
  if (memory.size > 500) {
    for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
  }
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function checkRateLimit(request: Request): Promise<RateLimitResult> {
  const key = `templatos:ai:${clientIp(request)}`;
  if (redis) {
    try {
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, WINDOW_SECONDS);
      if (count > MAX_REQUESTS) {
        const ttl = await redis.ttl(key);
        return { allowed: false, retryAfterSeconds: ttl > 0 ? ttl : WINDOW_SECONDS };
      }
      return { allowed: true, retryAfterSeconds: 0 };
    } catch {
      // If Redis is unreachable, degrade to the in-process limiter rather than blocking everyone.
      return memoryLimit(key);
    }
  }
  return memoryLimit(key);
}

/** Test helper. */
export function resetRateLimitMemory() {
  memory.clear();
}
