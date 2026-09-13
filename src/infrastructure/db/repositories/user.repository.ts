import { eq } from "drizzle-orm";

import { InvariantViolationError } from "@domain/errors";

import { users } from "../drizzle/schema";

import type { Database } from "../drizzle/client";
import type { User, UserId, UserRole, UserStatus } from "@domain/entities";
import type { IUserRepository, CreateUserInput, UpdateUserInput } from "@domain/repositories";

export class DrizzleUserRepository implements IUserRepository {
  public constructor(private readonly db: Database) {}

  public async findById(id: UserId): Promise<User | null> {
    const [row] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);

    return row ? this.mapToUser(row) : null;
  }

  public async create(input: CreateUserInput): Promise<User> {
    const [row] = await this.db
      .insert(users)
      .values({
        role: input.role,
        status: input.status ?? "active",
      })
      .returning();

    if (!row) {
      throw new InvariantViolationError(
        "user_create_returned_no_row",
        "INSERT INTO users ... RETURNING returned no row"
      );
    }

    return this.mapToUser(row);
  }

  public async update(id: UserId, input: UpdateUserInput): Promise<User | null> {
    const [row] = await this.db.update(users).set(input).where(eq(users.id, id)).returning();

    return row ? this.mapToUser(row) : null;
  }

  public async softDelete(id: UserId): Promise<void> {
    await this.db.update(users).set({ deleted_at: new Date() }).where(eq(users.id, id));
  }

  private mapToUser(row: typeof users.$inferSelect): User {
    return {
      id: row.id as UserId,
      role: row.role as UserRole,
      status: row.status as UserStatus,
      lastSeenAt: row.last_seen_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }
}
