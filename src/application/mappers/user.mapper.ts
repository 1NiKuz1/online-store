import type { UserDto } from "../dto";
import type { User } from "@domain/entities";

export function mapUserToDto(user: User): UserDto {
  return {
    id: user.id,
    role: user.role,
    status: user.status,
    lastSeenAt: user.lastSeenAt.toISOString(),
    createdAt: user.createdAt.toISOString(),
  };
}
