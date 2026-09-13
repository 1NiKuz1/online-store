import { type Serialized, sessionSerializer } from "../serializers";

import type { ICacheService, ISessionService } from "../ports";
import type { Session, SessionId, UserId } from "@domain/entities";
import type { ISessionRepository } from "@domain/repositories";

const SESSION_KEY_PREFIX = "session:";
const MAX_CACHE_TTL_SECONDS = 5 * 60;

export class SessionService implements ISessionService {
  public constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly cacheService: ICacheService
  ) {}

  public async findActiveByTokenHash(tokenHash: string): Promise<Session | null> {
    const key = this.buildKey(tokenHash);

    const cached = await this.cacheService.get<Serialized<Session>>(key);
    if (cached !== null) return sessionSerializer.deserialize(cached);

    const session = await this.sessionRepository.findActiveByTokenHash(tokenHash);
    if (session === null) return null;

    const remainingTtl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);
    const ttl = Math.min(remainingTtl, MAX_CACHE_TTL_SECONDS);
    if (ttl > 0) {
      await this.cacheService.set(key, sessionSerializer.serialize(session), { ttlSeconds: ttl });
    }

    return session;
  }

  public async revoke(id: SessionId): Promise<void> {
    const session = await this.sessionRepository.revoke(id);
    if (session !== null) {
      await this.invalidate(session.tokenHash);
    }
  }

  public async revokeAllForUser(userId: UserId): Promise<void> {
    const sessions = await this.sessionRepository.revokeAllByUserId(userId);
    await Promise.all(sessions.map((s) => this.invalidate(s.tokenHash)));
  }

  public async invalidate(tokenHash: string): Promise<void> {
    await this.cacheService.delete(this.buildKey(tokenHash));
  }

  private buildKey(tokenHash: string): string {
    return `${SESSION_KEY_PREFIX}${tokenHash}`;
  }
}
