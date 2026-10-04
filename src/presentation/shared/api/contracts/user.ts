import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  role: z.string(),
  status: z.string(),
  lastSeenAt: z.string(),
  createdAt: z.string(),
});
export type User = z.infer<typeof UserSchema>;
