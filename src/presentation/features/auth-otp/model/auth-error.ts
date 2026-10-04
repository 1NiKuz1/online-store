import { ApiError, type IdentityType } from "@presentation/shared/api";

export type AuthError = {
  type: IdentityType;
  value: string;
  message: string;
  retryAt: string | null;
};

type AuthErrorKey = { type: IdentityType; value: string };

export function toAuthError(e: unknown, key: AuthErrorKey): AuthError {
  if (e instanceof ApiError) {
    const retryAfterSec = typeof e.body.retryAfter === "number" ? e.body.retryAfter : null;
    return {
      type: key.type,
      value: key.value,
      message: e.body.error,
      retryAt:
        retryAfterSec !== null ? new Date(Date.now() + retryAfterSec * 1000).toISOString() : null,
    };
  }
  return {
    type: key.type,
    value: key.value,
    message: e instanceof Error ? e.message : String(e),
    retryAt: null,
  };
}
