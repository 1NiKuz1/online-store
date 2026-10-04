import { apiFetch } from "@presentation/shared/api";

export function logout(): Promise<void> {
  return apiFetch("/api/auth/logout", { method: "POST" });
}
