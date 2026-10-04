export const SESSION_ROOTS = ["session"] as const;
export type SessionRoot = (typeof SESSION_ROOTS)[number];

const SESSION_ROOT_SET: ReadonlySet<string> = new Set(SESSION_ROOTS);

export function isSessionScopedQuery(query: { queryKey: readonly unknown[] }): boolean {
  return SESSION_ROOT_SET.has(String(query.queryKey[0]));
}
