import type { ISerializer } from "./serializer";
import type { UserIdentity } from "@domain/entities";

export const userIdentitySerializer: ISerializer<UserIdentity> = {
  serialize: (identity) => ({
    ...identity,
    createdAt: identity.createdAt.getTime(),
  }),

  deserialize: (raw) => ({
    ...raw,
    createdAt: new Date(raw.createdAt),
  }),
};
