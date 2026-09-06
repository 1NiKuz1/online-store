import { env } from "@common/env";

import type { Config } from "drizzle-kit";

export default {
  schema: "./src/infrastructure/db/drizzle/schema.ts",
  out: "./src/infrastructure/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: process.env.DRIZZLE_VERBOSE === "true",
  strict: true,
  breakpoints: true,
} satisfies Config;
