import type { Session } from "../entities/session";
import type { SessionId, UserId } from "../entities/types";

export interface CreateSessionInput {
  userId: UserId;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface ISessionRepository {
  findById(id: SessionId): Promise<Session | null>;
  findByTokenHash(tokenHash: string): Promise<Session | null>;
  create(input: CreateSessionInput): Promise<Session>;
  revoke(id: SessionId): Promise<void>;
  delete(id: SessionId): Promise<void>;
  deleteExpired(): Promise<void>;
  listActiveByUserId(userId: UserId): Promise<Session[]>;
}
