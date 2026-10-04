import { ApiError, apiFetch, UserResponseSchema } from "@presentation/shared/api";

import type { User } from "@presentation/shared/api";

export async function fetchMe({ signal }: { signal: AbortSignal }): Promise<User | null> {
  try {
    const { user } = await apiFetch("/api/auth/me", { schema: UserResponseSchema, signal });
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}
