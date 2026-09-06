import { relations } from "drizzle-orm";

import { users, userIdentities, sessions } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  identities: many(userIdentities),
  sessions: many(sessions),
}));

export const userIdentitiesRelations = relations(userIdentities, ({ one }) => ({
  user: one(users, {
    fields: [userIdentities.user_id],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.user_id],
    references: [users.id],
  }),
}));
