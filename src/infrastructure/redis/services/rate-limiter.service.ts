import { RateLimitExceededError } from "@domain/errors";

import { redis } from "../client";

import type { IRateLimiterService, RateLimiterOptions } from "@application/ports";

export class RateLimiterService implements IRateLimiterService {
  public async isAllowedFixedWindow(key: string, options: RateLimiterOptions): Promise<void> {
    const fullKey = `rate:${key}`;
    const { limit, windowSeconds } = options;

    const [count, ttl] = (await redis.eval(
      `
      local count = redis.call('INCR', KEYS[1])
      if count == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[1])
      end
      return { count, redis.call('TTL', KEYS[1]) }
      `,
      {
        keys: [fullKey],
        arguments: [String(windowSeconds)],
      }
    )) as [number, number];

    if (count > limit) {
      throw new RateLimitExceededError(Math.max(ttl, 0));
    }
  }
}
