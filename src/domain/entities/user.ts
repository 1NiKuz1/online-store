import type { UserId, UserRole, UserStatus } from "./types";

export interface User {
  id: UserId;
  role: UserRole;
  status: UserStatus;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
