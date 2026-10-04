import { apiFetch, UserResponseSchema } from "@presentation/shared/api";

import type { VerifyOtpRequest, UserResponse } from "@presentation/shared/api";

export function verifyOtp(payload: VerifyOtpRequest): Promise<UserResponse> {
  return apiFetch("/api/auth/verify-otp", {
    method: "POST",
    body: payload,
    schema: UserResponseSchema,
  });
}
