/**
 * Branded identifier types.
 * Plain strings at runtime, but TypeScript refuses to mix them
 * (e.g., passing a `UserId` where a `SessionId` is expected).
 */
export type UserId = string & { readonly __brand: "UserId" };
export type UserIdentityId = string & { readonly __brand: "UserIdentityId" };
export type SessionId = string & { readonly __brand: "SessionId" };

export type UserRole = "guest" | "customer" | "admin" | "manager";
export type UserStatus = "active" | "suspended" | "deleted";
export type IdentityType = "email" | "phone";
