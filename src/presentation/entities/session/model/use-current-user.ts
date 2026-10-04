"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { fetchMe } from "../api/fetch-me";

import { sessionQueryKeys } from "./query-keys";

import type { User } from "@presentation/shared/api";

export function useCurrentUser(): UseQueryResult<User | null, Error> {
  return useQuery({
    queryKey: sessionQueryKeys.me(),
    queryFn: fetchMe,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
  });
}
