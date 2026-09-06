import { and, eq } from "drizzle-orm";

import { userIdentities } from "../drizzle/schema";

import type { Database } from "../drizzle/client";
import type { UserIdentity, IdentityType, UserId, UserIdentityId } from "@domain/entities";
import type { CreateUserIdentityInput, IUserIdentityRepository } from "@domain/repositories";

export class DrizzleUserIdentityRepository implements IUserIdentityRepository {
  public constructor(private readonly db: Database) {}

  public async findById(id: UserIdentityId): Promise<UserIdentity | null> {
    const [row] = await this.db
      .select()
      .from(userIdentities)
      .where(eq(userIdentities.id, id))
      .limit(1);

    return row ? this.mapToUserIdentity(row) : null;
  }

  public async findByTypeAndValue(type: IdentityType, value: string): Promise<UserIdentity | null> {
    const [row] = await this.db
      .select()
      .from(userIdentities)
      .where(and(eq(userIdentities.type, type), eq(userIdentities.value, value)))
      .limit(1);

    return row ? this.mapToUserIdentity(row) : null;
  }

  public async create(input: CreateUserIdentityInput): Promise<UserIdentity> {
    const [row] = await this.db
      .insert(userIdentities)
      .values({
        user_id: input.userId,
        type: input.type,
        value: input.value,
      })
      .returning();

    if (!row) {
      throw new Error("Failed to create user identity");
    }

    return this.mapToUserIdentity(row);
  }

  public async deleteByUserIdAndType(userId: UserId, type: IdentityType): Promise<void> {
    await this.db
      .delete(userIdentities)
      .where(and(eq(userIdentities.user_id, userId), eq(userIdentities.type, type)));
  }

  public async listByUserId(userId: UserId): Promise<UserIdentity[]> {
    const rows = await this.db
      .select()
      .from(userIdentities)
      .where(eq(userIdentities.user_id, userId));

    return rows.map((row) => this.mapToUserIdentity(row));
  }

  private mapToUserIdentity(row: typeof userIdentities.$inferSelect): UserIdentity {
    return {
      id: row.id as UserIdentityId,
      userId: row.user_id as UserId,
      type: row.type as IdentityType,
      value: row.value,
      createdAt: row.created_at,
    };
  }
}
