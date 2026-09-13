import type { ISerializer } from "./serializer";
import type { Session } from "@domain/entities";

export const sessionSerializer: ISerializer<Session> = {
  serialize: (session) => ({
    ...session,
    expiresAt: session.expiresAt.getTime(),
    createdAt: session.createdAt.getTime(),
    revokedAt: session.revokedAt?.getTime() ?? null,
  }),

  deserialize: (raw) => ({
    ...raw,
    expiresAt: new Date(raw.expiresAt),
    createdAt: new Date(raw.createdAt),
    revokedAt: raw.revokedAt !== null ? new Date(raw.revokedAt) : null,
  }),
};
