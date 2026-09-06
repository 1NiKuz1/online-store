import { createClient, type RedisClientType } from "redis";

import { env } from "@common/env";

export type RedisClient = RedisClientType;

// Persist on globalThis so Next.js HMR doesn't open a new connection
// on every code change in dev.
const globalForRedis = globalThis as unknown as {
  redis?: RedisClient;
};

export const redis: RedisClient = globalForRedis.redis ?? createClient({ url: env.REDIS_URL });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

// Eagerly connect; failures are logged but do not crash the process
// (Redis is optional during the build step).
redis.connect().catch((err) => {
  console.error("Failed to connect to Redis", err);
});
