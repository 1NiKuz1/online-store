import { z } from "zod";

import { UserSchema } from "./user";

export const IdentityTypeSchema = z.enum(["email", "phone"]);
export type IdentityType = z.infer<typeof IdentityTypeSchema>;

export const emailIdentifierSchema = z
  .string()
  .trim()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email");

export const phoneIdentifierSchema = z
  .string()
  .trim()
  .regex(/^(?=(?:\D*\d){7,15}\D*$)\+?[\d\s()-]+$/, "Enter a valid phone number");

export const identifierSchemas = {
  email: emailIdentifierSchema,
  phone: phoneIdentifierSchema,
} as const satisfies Record<IdentityType, z.ZodType<string>>;

export const RequestOtpRequestSchema = z.object({
  type: IdentityTypeSchema,
  value: z.string().trim().min(1, "Value is required"),
});
export type RequestOtpRequest = z.infer<typeof RequestOtpRequestSchema>;

export const RequestOtpResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  expiresAt: z.string(),
});
export type RequestOtpResponse = z.infer<typeof RequestOtpResponseSchema>;

export const VerifyOtpRequestSchema = z.object({
  type: IdentityTypeSchema,
  value: z.string().trim().min(1),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});
export type VerifyOtpRequest = z.infer<typeof VerifyOtpRequestSchema>;

export const UserResponseSchema = z.object({
  user: UserSchema,
});
export type UserResponse = z.infer<typeof UserResponseSchema>;
