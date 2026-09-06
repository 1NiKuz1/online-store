import { createHash, randomBytes } from "crypto";

export function createSha256Hash(str: string): string {
  return createHash("sha256").update(str).digest("hex");
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}
