"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionQueryKeys, isSessionScopedQuery } from "@presentation/entities/session";

import { verifyOtp } from "../api/verify-otp";

import type { User, VerifyOtpRequest, UserResponse } from "@presentation/shared/api";
import type { UseMutationResult } from "@tanstack/react-query";

export function useVerifyOtp(): UseMutationResult<UserResponse, Error, VerifyOtpRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: async ({ user }) => {
      await queryClient.cancelQueries({ predicate: isSessionScopedQuery });
      queryClient.removeQueries({ predicate: isSessionScopedQuery });
      queryClient.setQueryData<User | null>(sessionQueryKeys.me(), user);
    },
  });
}
