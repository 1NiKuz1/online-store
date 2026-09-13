import type { SessionId, UserId } from "./types";

export interface Session {
  id: SessionId;
  userId: UserId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
  ipAddress: string | null;
  userAgent: string | null;
}
