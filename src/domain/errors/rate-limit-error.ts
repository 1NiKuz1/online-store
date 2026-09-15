import { DomainError } from "./domain-error";

/** Request rate limit exceeded (e.g., too many OTP sends for the same identifier). */
export class RateLimitExceededError extends DomainError {
  constructor(public readonly retryAfter: number) {
    super("Rate limit exceeded");
  }
}
