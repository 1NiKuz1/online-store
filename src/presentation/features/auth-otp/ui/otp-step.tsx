"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";

import { formatCountdown, useCountdown } from "@presentation/shared/lib";
import { Button } from "@presentation/shared/shadcn/ui/button";
import { FieldError } from "@presentation/shared/shadcn/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@presentation/shared/shadcn/ui/input-otp";

import type { IdentityType } from "@presentation/shared/api";

const OTP_LENGTH = 6;

type OtpStepProps = {
  type: IdentityType;
  value: string;
  expiresAt: string | null;
  retryAt: string | null;
  error: Error | null;
  isSubmitting: boolean;
  onSubmit: (code: string) => Promise<boolean>;
  onResend: () => Promise<boolean>;
  onBack: () => void;
  onClearError: () => void;
};

export function OtpStep({
  type,
  value,
  expiresAt,
  retryAt,
  error,
  isSubmitting,
  onSubmit,
  onResend,
  onBack,
  onClearError,
}: OtpStepProps): React.ReactNode {
  const [code, setCode] = useState("");
  const secondsLeft = useCountdown(expiresAt);
  const retrySeconds = useCountdown(retryAt);
  const isExpired = secondsLeft !== null && secondsLeft <= 0;
  const isRetryBlocked = retrySeconds !== null && retrySeconds > 0;

  const handleChange = (code: string): void => {
    setCode(code);
    if (error) onClearError();
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (code.length !== OTP_LENGTH) return;
    const ok = await onSubmit(code);
    if (!ok) setCode("");
  };

  const handleResend = async (): Promise<void> => {
    const ok = await onResend();
    if (ok) setCode("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        We sent a code to <span className="font-medium text-foreground">{value}</span>.
      </p>

      <div className="flex flex-col items-center gap-3">
        <InputOTP
          maxLength={OTP_LENGTH}
          value={code}
          onChange={handleChange}
          pattern={REGEXP_ONLY_DIGITS}
          disabled={isSubmitting || isExpired || isRetryBlocked}
          autoComplete="one-time-code"
          containerClassName="justify-center"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        {secondsLeft !== null && !isExpired && (
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Expires in {formatCountdown(secondsLeft)}
          </p>
        )}
        {isExpired && (
          <p className="text-xs tracking-wide text-destructive uppercase">Code expired</p>
        )}
        {isRetryBlocked && retrySeconds !== null && (
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Retry in {formatCountdown(retrySeconds)}
          </p>
        )}
      </div>

      {error && <FieldError errors={[{ message: error.message }]} />}

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isExpired || isRetryBlocked || code.length !== OTP_LENGTH}
        >
          Verify
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Change {type}
          </Button>
          <Button
            type="button"
            variant={isExpired ? "default" : "outline"}
            className="flex-1"
            onClick={handleResend}
            disabled={isSubmitting || isRetryBlocked}
          >
            Resend
          </Button>
        </div>
      </div>
    </form>
  );
}
