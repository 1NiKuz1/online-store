import type { ISerializer } from "./serializer";
import type { User } from "@domain/entities";

export const userSerializer: ISerializer<User> = {
  serialize: (user) => ({
    ...user,
    lastSeenAt: user.lastSeenAt.getTime(),
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
    deletedAt: user.deletedAt?.getTime() ?? null,
  }),

  deserialize: (raw) => ({
    ...raw,
    lastSeenAt: new Date(raw.lastSeenAt),
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    deletedAt: raw.deletedAt !== null ? new Date(raw.deletedAt) : null,
  }),
};
