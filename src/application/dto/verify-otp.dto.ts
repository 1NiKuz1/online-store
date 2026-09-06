import { z } from "zod";

export const VerifyOtpSchema = z.object({
  type: z.enum(["email", "phone"]),
  value: z.string().trim().min(1, "Value is required"),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;

export interface UserDto {
  id: string;
  role: string;
  status: string;
  lastSeenAt: string;
  createdAt: string;
}

export interface VerifyOtpDto {
  user: UserDto;
  /** Raw session token to be set as a cookie. */
  sessionToken: string;
  /** Cookie lifetime in seconds. */
  maxAge: number;
}

export interface ClientInfo {
  ipAddress: string | null;
  userAgent: string | null;
}
