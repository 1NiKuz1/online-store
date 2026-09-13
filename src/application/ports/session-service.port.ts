import type { Session, SessionId, UserId } from "@domain/entities";

export interface ISessionService {
  /**
   * Returns the active (non-expired, non-revoked) session for the given
   * token hash, reading through cache. Returns null if none exists.
   */
  findActiveByTokenHash(tokenHash: string): Promise<Session | null>;
  revoke(id: SessionId): Promise<void>;
  revokeAllForUser(userId: UserId): Promise<void>;
  invalidate(tokenHash: string): Promise<void>;
}
