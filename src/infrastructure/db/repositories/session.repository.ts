import { and, eq, gt, isNull, lt } from "drizzle-orm";

import { InvariantViolationError } from "@domain/errors";

import { sessions } from "../drizzle/schema";

import type { Database } from "../drizzle/client";
import type { Session, SessionId, UserId } from "@domain/entities";
import type { CreateSessionInput, ISessionRepository } from "@domain/repositories";

export class DrizzleSessionRepository implements ISessionRepository {
  public constructor(private readonly db: Database) {}

  public async findById(id: SessionId): Promise<Session | null> {
    const [row] = await this.db.select().from(sessions).where(eq(sessions.id, id)).limit(1);

    return row ? this.mapToSession(row) : null;
  }

  public async findByTokenHash(tokenHash: string): Promise<Session | null> {
    const [row] = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.token_hash, tokenHash))
      .limit(1);

    return row ? this.mapToSession(row) : null;
  }

  public async findActiveByTokenHash(tokenHash: string): Promise<Session | null> {
    const now = new Date();
    const [row] = await this.db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.token_hash, tokenHash),
          isNull(sessions.revoked_at),
          gt(sessions.expires_at, now)
        )
      )
      .limit(1);

    return row ? this.mapToSession(row) : null;
  }

  public async create(input: CreateSessionInput): Promise<Session> {
    const [row] = await this.db
      .insert(sessions)
      .values({
        user_id: input.userId,
        token_hash: input.tokenHash,
        expires_at: input.expiresAt,
        ip_address: input.ipAddress ?? null,
        user_agent: input.userAgent ?? null,
      })
      .returning();

    if (!row) {
      throw new InvariantViolationError(
        "session_create_returned_no_row",
        "INSERT INTO sessions ... RETURNING returned no row"
      );
    }

    return this.mapToSession(row);
  }

  public async revokeAllByUserId(userId: UserId): Promise<Session[]> {
    const rows = await this.db
      .update(sessions)
      .set({ revoked_at: new Date() })
      .where(and(eq(sessions.user_id, userId), isNull(sessions.revoked_at)))
      .returning();

    return rows.map((row) => this.mapToSession(row));
  }

  public async revoke(id: SessionId): Promise<Session | null> {
    const [row] = await this.db
      .update(sessions)
      .set({ revoked_at: new Date() })
      .where(eq(sessions.id, id))
      .returning();

    return row ? this.mapToSession(row) : null;
  }

  public async delete(id: SessionId): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.id, id));
  }

  public async deleteExpired(): Promise<void> {
    await this.db.delete(sessions).where(lt(sessions.expires_at, new Date()));
  }

  public async listActiveByUserId(userId: UserId): Promise<Session[]> {
    const now = new Date();
    const rows = await this.db
      .select()
      .from(sessions)
      .where(
        and(eq(sessions.user_id, userId), isNull(sessions.revoked_at), gt(sessions.expires_at, now))
      );

    return rows.map((row) => this.mapToSession(row));
  }

  private mapToSession(row: typeof sessions.$inferSelect): Session {
    return {
      id: row.id as SessionId,
      userId: row.user_id as UserId,
      tokenHash: row.token_hash,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      revokedAt: row.revoked_at,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
    };
  }
}
