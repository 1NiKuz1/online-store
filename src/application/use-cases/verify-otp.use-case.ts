import { InvariantViolationError, UserNotAccessibleError } from "@/domain/errors";
import { createSha256Hash, generateSessionToken } from "@common/utils";

import { VerifyOtpSchema } from "../dto";
import { normalizeIdentifier } from "../utils";

import type { ClientInfo, UserDto, VerifyOtpDto, VerifyOtpInput } from "../dto";
import type { IOtpService } from "../ports";
import type { IUnitOfWork, TransactionContext } from "../ports/unit-of-work.port";
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

    return this.unitOfWork.transaction("verify-otp", async (ctx) => {
      const { userId, isNewUser } = await this.resolveOrCreateUser(ctx, type, normalizedValue);

      if (isNewUser) {
        await ctx.userIdentityRepository.create({
          userId,
          type,
          value: normalizedValue,
        });
      }

      const { sessionToken } = await this.createSession(ctx, userId, clientInfo);
      const user = await this.loadUserForResponse(ctx, userId);

      return {
        user: this.mapUserToDto(user),
        sessionToken,
        maxAge: SESSION_TTL_SECONDS,
      };
    });
  }

  private async resolveOrCreateUser(
    ctx: TransactionContext,
    type: "email" | "phone",
    normalizedValue: string
  ): Promise<{ userId: UserId; isNewUser: boolean }> {
    const existingIdentity = await ctx.userIdentityRepository.findByTypeAndValue(
      type,
      normalizedValue
    );

    if (!existingIdentity) {
      const newUser = await ctx.userRepository.create({ role: "customer" });
      return { userId: newUser.id, isNewUser: true };
    }

    const existingUser = await ctx.userRepository.findById(existingIdentity.userId);
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
    return { userId: existingUser.id, isNewUser: false };
  }

  private async createSession(
    ctx: TransactionContext,
    userId: UserId,
    clientInfo: ClientInfo
  ): Promise<{ sessionToken: string }> {
    const sessionToken = generateSessionToken();
    const tokenHash = createSha256Hash(sessionToken);
    const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

    await ctx.sessionRepository.create({
      userId,
      tokenHash,
      expiresAt,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    return { sessionToken };
  }

  private async loadUserForResponse(ctx: TransactionContext, userId: UserId): Promise<User> {
    const user = await ctx.userRepository.findById(userId);
    if (!user) {
      throw new InvariantViolationError(
        "user_disappeared",
        "user not found immediately after creation within the same transaction",
        { userId }
      );
    }
    return user;
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
