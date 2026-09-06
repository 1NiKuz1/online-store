import type { Handler, Middleware } from "./types";

/**
 * Composes middlewares into a single one.
 * Order: middlewares are applied outside-in, so the leftmost middleware in
 * the array becomes the outermost wrapper (it sees the final response/throw
 * first when unwinding).
 */
export function compose(...middlewares: Middleware[]): Middleware {
  return (handler: Handler) => middlewares.reduceRight((acc, mw) => mw(acc), handler);
}
