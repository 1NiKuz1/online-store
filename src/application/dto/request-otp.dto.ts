import { z } from "zod";

export const RequestOtpSchema = z.object({
  type: z.enum(["email", "phone"]),
  value: z.string().trim().min(1, "Value is required"),
});

export type RequestOtpInput = z.infer<typeof RequestOtpSchema>;

export interface RequestOtpDto {
  success: true;
  message: string;
}
