import { DomainError } from "./domain-error";

/** OTP code not found or has expired. */
export class OtpCodeNotFoundError extends DomainError {
  constructor() {
    super("OTP code not found or expired");
  }
}

/** Entered code is invalid. */
export class OtpInvalidCodeError extends DomainError {
  constructor() {
    super("Invalid OTP code");
  }
}

/** Maximum number of code entry attempts exceeded. */
export class OtpTooManyAttemptsError extends DomainError {
  constructor() {
    super("Too many OTP attempts");
  }
}
