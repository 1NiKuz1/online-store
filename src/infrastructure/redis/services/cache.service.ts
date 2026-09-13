import { redis } from "../client";

import type { CacheSetOptions, ICacheService } from "@application/ports";

const KEY_PREFIX = "cache:";

export class CacheService implements ICacheService {
  public async get<T>(key: string): Promise<T | null> {
    const fullKey = this.buildKey(key);
    const raw = await redis.get(fullKey);
    if (raw === null) return null;

    try {
      return JSON.parse(raw) as T;
    } catch (cause) {
      console.error("Corrupted cache entry, dropping", { key: fullKey, cause });
      await redis.del(fullKey);
      return null;
    }
  }

  public async set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void> {
    const payload = JSON.stringify(value);
    const fullKey = this.buildKey(key);

    if (options?.ttlSeconds !== undefined) {
      if (options.ttlSeconds <= 0) return;
      await redis.set(fullKey, payload, { EX: options.ttlSeconds });
    } else {
      await redis.set(fullKey, payload);
    }
  }

  public async delete(key: string): Promise<void> {
    await redis.del(this.buildKey(key));
  }

  public async getOrSet<T>(
    key: string,
    factory: () => Promise<T | null>,
    options?: CacheSetOptions
  ): Promise<T | null> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const value = await factory();
    if (value === null) return null;
    await this.set(key, value, options);
    return value;
  }

  private buildKey(key: string): string {
    return `${KEY_PREFIX}${key}`;
  }
}
