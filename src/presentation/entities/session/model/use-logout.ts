"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "../api/logout";

import { sessionQueryKeys } from "./query-keys";
import { isSessionScopedQuery } from "./session-scope";

import type { UseMutationResult } from "@tanstack/react-query";

export function useLogout(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.cancelQueries({ predicate: isSessionScopedQuery });
      queryClient.removeQueries({ predicate: isSessionScopedQuery });
      queryClient.setQueryData(sessionQueryKeys.me(), null);
    },
    onError: (error) => {
      console.error("Logout failed", error);
    },
  });
}
