import { type IdentityType } from "@domain/entities";

/**
 * Normalizes a user identifier for storage/lookup.
 * Email is lower-cased and trimmed; phone is reduced to digits and `+`,
 * with a leading `+` added if missing.
 */
export function normalizeIdentifier(type: IdentityType, value: string): string {
  if (type === "email") {
    return value.trim().toLowerCase();
  }
  let cleaned = value.replace(/[^\d+]/g, "");
  if (!cleaned.startsWith("+")) {
    cleaned = `+${cleaned}`;
  }
  return cleaned;
}
