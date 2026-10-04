"use client";

import { User } from "lucide-react";
import { useCallback, useState } from "react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@presentation/shared/shadcn/ui/sheet";
import { ToolbarIconButton } from "@presentation/shared/ui/toolbar";

import { useAuthFlow } from "../model/use-auth-flow";

import { IdentifierStep } from "./identifier-step";
import { OtpStep } from "./otp-step";

export function AuthSheet(): React.ReactNode {
  const [open, setOpen] = useState(false);

  const handleVerified = useCallback((): void => {
    setOpen(false);
  }, []);

  const flow = useAuthFlow({ onVerified: handleVerified });

  const handleOpenChange = (open: boolean): void => {
    setOpen(open);
    if (!open) flow.reset();
  };

  const title = flow.state.step === "identifier" ? "Sign in" : "Verify code";
  const description =
    flow.state.step === "identifier"
      ? "Enter your email or phone to receive a one-time code."
      : "Enter the 6-digit code we sent you.";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<ToolbarIconButton icon={<User />} label="Account" />} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="px-8 pb-8">
          {flow.state.step === "identifier" ? (
            <IdentifierStep
              type={flow.state.type}
              initialValue={flow.state.values[flow.state.type]}
              error={flow.error}
              retryAt={flow.retryAt}
              disabled={flow.isSubmitting}
              onChangeValue={flow.setValue}
              onChangeType={flow.setIdentityType}
              onSubmit={flow.submitIdentifier}
            />
          ) : (
            <OtpStep
              type={flow.state.type}
              value={flow.state.values[flow.state.type]}
              expiresAt={flow.state.expiresAt}
              retryAt={flow.retryAt}
              error={flow.error}
              isSubmitting={flow.isSubmitting}
              onSubmit={flow.submitOtp}
              onResend={flow.resendOtp}
              onBack={flow.backToIdentifier}
              onClearError={flow.clearError}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
