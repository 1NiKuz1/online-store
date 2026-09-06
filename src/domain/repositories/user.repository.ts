import type { UserId, UserRole, UserStatus } from "../entities/types";
import type { User } from "../entities/user";

export interface CreateUserInput {
  role: UserRole;
  status?: UserStatus;
}

export interface UpdateUserInput {
  role?: UserRole;
  status?: UserStatus;
  lastSeenAt?: Date;
  deletedAt?: Date | null;
}

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: UserId, input: UpdateUserInput): Promise<User | null>;
  /** Soft delete: sets `deletedAt = now`. */
  softDelete(id: UserId): Promise<void>;
}
