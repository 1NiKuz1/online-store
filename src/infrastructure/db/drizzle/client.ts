import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@common/env";

import * as relations from "./relations";
import * as tables from "./schema";

const schema = { ...tables, ...relations };

export type Database = PostgresJsDatabase<typeof schema>;

// Persist the pool on globalThis so Next.js HMR doesn't open a new one
// on every code change in dev.
const globalForDb = globalThis as unknown as {
  db?: Database;
};

export const db: Database =
  globalForDb.db ?? drizzle(postgres(env.DATABASE_URL, { max: 10 }), { schema });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
