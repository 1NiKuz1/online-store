import { DomainError } from "./domain-error";

/**
 * A domain invariant has been violated.
 * This indicates a programmer error or data corruption, not an expected
 * user-facing situation. Callers should map it to a 5xx response and alert.
 */
export class InvariantViolationError extends DomainError {
  constructor(
    public readonly kind: string,
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(`Invariant violation [${kind}]: ${message}`);
  }
}
