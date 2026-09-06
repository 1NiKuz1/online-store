export interface IOtpService {
  /**
   * Generates a one-time code, stores its hash, and returns the plain code
   * for the caller to deliver to the user.
   */
  generateCode(type: "email" | "phone", value: string): Promise<string>;

  /**
   * Verifies the entered code against the stored hash.
   * Throws `OtpInvalidCodeError`, `OtpCodeNotFoundError`, or
   * `OtpTooManyAttemptsError` on failure. Resolves with no value on success.
   */
  verifyCode(type: "email" | "phone", value: string, code: string): Promise<void>;
}
