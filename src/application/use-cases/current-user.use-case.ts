import { InvariantViolationError, UserNotAccessibleError } from "@domain/errors";

import { mapUserToDto } from "../mappers";

import type { UserDto } from "../dto";
import type { UserId } from "@domain/entities";
import type { IUserRepository } from "@domain/repositories";

export class CurrentUserUseCase {
  public constructor(private readonly userRepository: IUserRepository) {}

  public async execute(userId: UserId): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new InvariantViolationError(
        "user_disappeared",
        "session references non-existent user",
        { userId }
      );
    }
    if (user.deletedAt || user.status !== "active") {
      throw new UserNotAccessibleError(user.id, user.status, user.deletedAt ?? null);
    }
    return mapUserToDto(user);
  }
}
