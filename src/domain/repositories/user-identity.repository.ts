import type { IdentityType, UserId, UserIdentityId, UserIdentity } from "../entities";

export interface CreateUserIdentityInput {
  userId: UserId;
  type: IdentityType;
  /** Normalized value (email in lower case, phone in E.164). */
  value: string;
}

export interface IUserIdentityRepository {
  findById(id: UserIdentityId): Promise<UserIdentity | null>;
  findByTypeAndValue(type: IdentityType, value: string): Promise<UserIdentity | null>;
  create(input: CreateUserIdentityInput): Promise<UserIdentity>;
  deleteByUserIdAndType(userId: UserId, type: IdentityType): Promise<void>;
  listByUserId(userId: UserId): Promise<UserIdentity[]>;
}
