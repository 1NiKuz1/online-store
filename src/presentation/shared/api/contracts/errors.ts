import { z } from "zod";

export const ApiErrorSchema = z.object({
  error: z.string(),
  details: z.array(z.unknown()).optional(),
  retryAfter: z.number().optional(),
});
export type ApiErrorBody = z.infer<typeof ApiErrorSchema>;
