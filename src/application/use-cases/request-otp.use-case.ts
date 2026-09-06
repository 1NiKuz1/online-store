import { RequestOtpSchema } from "../dto";
import { normalizeIdentifier } from "../utils";

import type { RequestOtpInput, RequestOtpDto } from "../dto";
import type { IMessageService, IOtpService, IRateLimiterService } from "../ports";

export class RequestOtpUseCase {
  public constructor(
    private readonly otpService: IOtpService,
    private readonly rateLimiterService: IRateLimiterService,
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

    const code = await this.otpService.generateCode(type, normalizedValue);

    if (type === "email") {
      await this.emailService.send(normalizedValue, `Your OTP code: ${code}`);
    } else {
      await this.smsService.send(normalizedValue, `Your OTP code: ${code}`);
    }

    return {
      success: true,
      message: "OTP sent successfully",
    };
  }
}
