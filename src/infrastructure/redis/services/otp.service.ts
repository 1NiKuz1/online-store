import { randomInt } from "crypto";

import { createSha256Hash } from "@common/utils";
import { OtpCodeNotFoundError, OtpInvalidCodeError, OtpTooManyAttemptsError } from "@domain/errors";

import { redis } from "../client";

import type { IOtpService } from "@application/ports";

const OTP_TTL_SECONDS = 5 * 60; // 5 minutes
const MAX_ATTEMPTS = 5;

interface OtpStoredData {
  codeHash: string;
  attempts: number;
}

export class OtpService implements IOtpService {
  async generateCode(type: "email" | "phone", value: string): Promise<string> {
    const code = randomInt(100000, 999999).toString();
    const codeHash = createSha256Hash(code);
    const key = this.getKey(type, value);

    const data: OtpStoredData = {
      codeHash,
      attempts: 0,
    };

    await redis.set(key, JSON.stringify(data), {
      EX: OTP_TTL_SECONDS,
    });

    return code;
  }

  async verifyCode(type: "email" | "phone", value: string, code: string): Promise<void> {
    const key = this.getKey(type, value);
    const codeHash = createSha256Hash(code);

    // Atomic check + attempt counter increment via Lua.
    // Return codes:
    //   1 — match: key deleted
    //   0 — mismatch: attempt counter incremented
    //  -1 — limit reached: key deleted
    //  -2 — key absent (expired or never generated)
    const result = await redis.eval(
      `
      local data = redis.call('GET', KEYS[1])
      if not data then
        return -2
      end
      local parsed = cjson.decode(data)
      if parsed.attempts >= tonumber(ARGV[1]) then
        redis.call('DEL', KEYS[1])
        return -1
      end
      if parsed.codeHash == ARGV[2] then
        redis.call('DEL', KEYS[1])
        return 1
      else
        parsed.attempts = parsed.attempts + 1
        redis.call('SET', KEYS[1], cjson.encode(parsed), 'EX', redis.call('TTL', KEYS[1]))
        return 0
      end
      `,
      {
        keys: [key],
        arguments: [String(MAX_ATTEMPTS), codeHash],
      }
    );

    switch (result) {
      case 1:
        return;
      case 0:
        throw new OtpInvalidCodeError();
      case -1:
        throw new OtpTooManyAttemptsError();
      case -2:
        throw new OtpCodeNotFoundError();
      default:
        throw new OtpCodeNotFoundError();
    }
  }

  private getKey(type: "email" | "phone", value: string): string {
    return `otp:${type}:${value}`;
  }
}
