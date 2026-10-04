"use client";

import { useNow } from "./use-now";

export function useCountdown(expiresAt: string | null): number | null {
  const now = useNow();

  if (now === null || expiresAt === null) return null;

  const diff = new Date(expiresAt).getTime() - now;
  return Math.max(0, Math.floor(diff / 1000));
}
