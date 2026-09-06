import type { IdentityType, UserId, UserIdentityId } from "./types";

export interface UserIdentity {
  id: UserIdentityId;
  userId: UserId;
  type: IdentityType;
  /** Normalized value: email in lower case, phone in E.164. */
  value: string;
  createdAt: Date;
}
