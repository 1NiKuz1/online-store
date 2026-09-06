import { sql } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, inet, check, unique, index } from "drizzle-orm/pg-core";

/**
 * Users (guests, customers, administrators, managers).
 * Guests and registered users share a single table; the `role` column
 * distinguishes them.
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    role: text("role").notNull().default("guest"),
    status: text("status").notNull().default("active"),
    last_seen_at: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    checkRole: check(
      "users_role_check",
      sql`${table.role} IN ('guest', 'customer', 'admin', 'manager')`
    ),
    checkStatus: check(
      "users_status_check",
      sql`${table.status} IN ('active', 'suspended', 'deleted')`
    ),
    // Partial index kept narrow so the daily inactive-guest cleanup stays cheap.
    idxUsersGuestLastSeen: index("idx_users_guest_last_seen")
      .on(table.role, table.last_seen_at)
      .where(sql`${table.role} = 'guest' AND ${table.deleted_at} IS NULL`),
  })
);

/**
 * Confirmed identifiers (email, phone).
 * A row exists only after successful OTP verification.
 */
export const userIdentities = pgTable(
  "user_identities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    value: text("value").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    checkType: check("user_identities_type_check", sql`${table.type} IN ('email', 'phone')`),
    uqIdentityValue: unique("uq_identity_value").on(table.type, table.value),
    uqUserIdentityType: unique("uq_user_identity_type").on(table.user_id, table.type),
    idxUserIdentitiesUserId: index("idx_user_identities_user_id").on(table.user_id),
  })
);

/** Sessions. Only the SHA-256 hash of the token is stored. */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token_hash: text("token_hash").notNull().unique(),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    revoked_at: timestamp("revoked_at", { withTimezone: true }),
    ip_address: inet("ip_address"),
    user_agent: text("user_agent"),
  },
  (table) => ({
    idxSessionsUserId: index("idx_sessions_user_id").on(table.user_id),
    idxSessionsTokenHash: index("idx_sessions_token_hash").on(table.token_hash),
    idx_sessions_expires_at: index("idx_sessions_expires_at").on(table.expires_at),
  })
);
