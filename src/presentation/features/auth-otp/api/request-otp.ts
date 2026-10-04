import { apiFetch, RequestOtpResponseSchema } from "@presentation/shared/api";

import type { RequestOtpRequest, RequestOtpResponse } from "@presentation/shared/api";

export function requestOtp(payload: RequestOtpRequest): Promise<RequestOtpResponse> {
  return apiFetch("/api/auth/request-otp", {
    method: "POST",
    body: payload,
    schema: RequestOtpResponseSchema,
  });
}
