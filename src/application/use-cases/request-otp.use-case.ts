import { InvariantViolationError, UserNotAccessibleError } from "@domain/errors";

import { RequestOtpSchema } from "../dto";
import { normalizeIdentifier } from "../utils";

import type { RequestOtpInput, RequestOtpDto } from "../dto";
import type { IMessageService, IOtpService, IRateLimiterService } from "../ports";
import type { IUserIdentityRepository, IUserRepository } from "@domain/repositories";

export class RequestOtpUseCase {
  public constructor(
    private readonly otpService: IOtpService,
    private readonly rateLimiterService: IRateLimiterService,
    private readonly userIdentityRepository: IUserIdentityRepository,
    private readonly userRepository: IUserRepository,
    private readonly emailService: IMessageService,
    private readonly smsService: IMessageService
  ) {}

  public async execute(input: RequestOtpInput): Promise<RequestOtpDto> {
    const { type, value } = RequestOtpSchema.parse(input);
    const normalizedValue = normalizeIdentifier(type, value);

    await this.rateLimiterService.isAllowedFixedWindow(`${type}:${normalizedValue}`, {
      limit: 3,
      windowSeconds: 15 * 60,
    });

    await this.assertRecipientIsAccessible(type, normalizedValue);

    const { code, expiresAt } = await this.otpService.issue(type, normalizedValue);

    if (type === "email") {
      await this.emailService.send(normalizedValue, `Your OTP code: ${code}`);
    } else {
      await this.smsService.send(normalizedValue, `Your OTP code: ${code}`);
    }

    return {
      success: true,
      message: "OTP sent successfully",
      expiresAt,
    };
  }

  private async assertRecipientIsAccessible(
    type: "email" | "phone",
    normalizedValue: string
  ): Promise<void> {
    const existingIdentity = await this.userIdentityRepository.findByTypeAndValue(
      type,
      normalizedValue
    );
    if (!existingIdentity) {
      return;
    }

    const user = await this.userRepository.findById(existingIdentity.userId);
    if (!user) {
      throw new InvariantViolationError(
        "identity_orphan",
        "user_identities row references non-existent user",
        { userId: existingIdentity.userId, type, value: normalizedValue }
      );
    }

    if (user.deletedAt || user.status !== "active") {
      throw new UserNotAccessibleError(user.id, user.status, user.deletedAt ?? null);
    }
  }
}
