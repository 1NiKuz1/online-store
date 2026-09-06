import { DomainError } from "./domain-error";

/**
 * Database transaction failed (rollback, connection loss, unique violation, etc.).
 * Signals that the operation was not applied. The underlying cause is on `cause`.
 */
export class TransactionFailedError extends DomainError {
  constructor(
    public readonly operation: string,
    cause?: unknown
  ) {
    super(`Transaction failed during "${operation}"`);
    if (cause !== undefined) {
      this.cause = cause;
    }
  }
}
