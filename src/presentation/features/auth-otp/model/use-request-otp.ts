"use client";

import { useMutation } from "@tanstack/react-query";

import { requestOtp } from "../api/request-otp";

import type { RequestOtpRequest, RequestOtpResponse } from "@presentation/shared/api";
import type { UseMutationResult } from "@tanstack/react-query";

export function useRequestOtp(): UseMutationResult<RequestOtpResponse, Error, RequestOtpRequest> {
  return useMutation({
    mutationFn: requestOtp,
  });
}
