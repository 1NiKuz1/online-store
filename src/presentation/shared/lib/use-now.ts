"use client";

import { useSyncExternalStore } from "react";

let currentTime: number | null = null;
let timeoutId: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    currentTime = Date.now();
    const tick = (): void => {
      currentTime = Date.now();
      listeners.forEach((l) => l());
      timeoutId = setTimeout(tick, 1000);
    };
    tick();
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      currentTime = null;
    }
  };
}

function getSnapshot(): number | null {
  return currentTime;
}

function getServerSnapshot(): number | null {
  return null;
}

export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
