import type { SessionId, UserId, Session } from "../entities";

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
  /** Returns the session only if it is neither revoked nor expired. */
  findActiveByTokenHash(tokenHash: string): Promise<Session | null>;
  create(input: CreateSessionInput): Promise<Session>;
  revoke(id: SessionId): Promise<Session | null>;
  revokeAllByUserId(userId: UserId): Promise<Session[]>;
  delete(id: SessionId): Promise<void>;
  deleteExpired(): Promise<void>;
  listActiveByUserId(userId: UserId): Promise<Session[]>;
}
