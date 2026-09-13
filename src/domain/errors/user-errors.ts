import { DomainError } from "./domain-error";
import { InvariantViolationError } from "./invariant-error";

import type { UserId, UserStatus } from "../entities";

/**
 * User account is not accessible for sign-in.
 * Triggered by `status === 'suspended' | 'deleted'` or a non-null `deletedAt`.
 *
 * Constructing this with an `active` user and no `deletedAt` is a programmer
 * error: the constructor itself throws to surface the bug at runtime.
 */
export class UserNotAccessibleError extends DomainError {
  public readonly reason: "suspended" | "deleted";

  constructor(
    public readonly userId: UserId,
    status: UserStatus,
    public readonly deletedAt: Date | null
  ) {
    let message: string;
    let reason: "suspended" | "deleted";

    if (status === "deleted" || deletedAt !== null) {
      message = "User is not accessible: deleted";
      reason = "deleted";
    } else if (status === "suspended") {
      message = "User is not accessible: suspended";
      reason = "suspended";
    } else {
      throw new InvariantViolationError(
        "user_not_accessible_invalid_construction",
        `UserNotAccessibleError invoked with status="${status}" and no deletedAt`,
        { userId, status }
      );
    }

    super(message);
    this.reason = reason;
  }
}
