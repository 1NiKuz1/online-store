export interface IssuedOtp {
  /** Plain code to be delivered to the user. */
  code: string;
  /** ISO-8601 timestamp when the code becomes invalid. */
  expiresAt: string;
}
export interface IOtpService {
  issue(type: "email" | "phone", value: string): Promise<IssuedOtp>;
  verify(type: "email" | "phone", value: string, code: string): Promise<void>;
}
