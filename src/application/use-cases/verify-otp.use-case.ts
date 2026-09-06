import { InvariantViolationError, UserNotAccessibleError } from "@/domain/errors";
import { createSha256Hash, generateSessionToken } from "@common/utils";

import { VerifyOtpSchema } from "../dto";
import { normalizeIdentifier } from "../utils";

import type { ClientInfo, UserDto, VerifyOtpDto, VerifyOtpInput } from "../dto";
import type { IOtpService } from "../ports";
import type { IUnitOfWork } from "../ports/unit-of-work.port";
import type { UserId } from "@domain/entities/types";
import type { User } from "@domain/entities/user";

const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

export class VerifyOtpUseCase {
  public constructor(
    private readonly otpService: IOtpService,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  public async execute(input: VerifyOtpInput, clientInfo: ClientInfo): Promise<VerifyOtpDto> {
    const { type, value, code } = VerifyOtpSchema.parse(input);
    const normalizedValue = normalizeIdentifier(type, value);

    await this.otpService.verifyCode(type, normalizedValue, code);

    return this.unitOfWork.transaction(
      "verify-otp",
      async ({ userRepository, userIdentityRepository, sessionRepository }) => {
        const existingIdentity = await userIdentityRepository.findByTypeAndValue(
          type,
          normalizedValue
        );

        let userId: UserId;
        if (existingIdentity) {
          const existingUser = await userRepository.findById(existingIdentity.userId);
          if (!existingUser) {
            throw new InvariantViolationError(
              "identity_orphan",
              "user_identities row references non-existent user",
              { userId: existingIdentity.userId, type, value: normalizedValue }
            );
          }
          if (existingUser.deletedAt || existingUser.status !== "active") {
            throw new UserNotAccessibleError(
              existingUser.id,
              existingUser.status,
              existingUser.deletedAt ?? null
            );
          }
          userId = existingUser.id;
        } else {
          const newUser = await userRepository.create({ role: "customer" });
          userId = newUser.id;

          await userIdentityRepository.create({
            userId,
            type,
            value: normalizedValue,
          });
        }

        const sessionToken = generateSessionToken();
        const tokenHash = createSha256Hash(sessionToken);
        const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

        await sessionRepository.create({
          userId,
          tokenHash,
          expiresAt,
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
        });

        const user = await userRepository.findById(userId);
        if (!user) {
          throw new InvariantViolationError(
            "user_disappeared",
            "user not found immediately after creation within the same transaction",
            { userId }
          );
        }

        return {
          user: this.mapUserToDto(user),
          sessionToken,
          maxAge: SESSION_TTL_SECONDS,
        };
      }
    );
  }

  private mapUserToDto(user: User): UserDto {
    return {
      id: user.id,
      role: user.role,
      status: user.status,
      lastSeenAt: user.lastSeenAt.toISOString(),
      createdAt: user.createdAt.toISOString(),
    };
  }
}
