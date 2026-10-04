"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { type IdentityType, identifierSchemas } from "@presentation/shared/api";
import { formatCountdown, useCountdown } from "@presentation/shared/lib";
import { Button } from "@presentation/shared/shadcn/ui/button";
import { Field, FieldError, FieldLabel } from "@presentation/shared/shadcn/ui/field";
import { Input } from "@presentation/shared/shadcn/ui/input";

import { IdentityTabs } from "./identity-tabs";

type IdentifierFormValues = { value: string };

type IdentifierFormProps = {
  type: IdentityType;
  initialValue: string;
  error: Error | null;
  retryAt: string | null;
  disabled: boolean;
  onChangeValue: (value: string) => void;
  onSubmit: (value: string) => Promise<boolean>;
};

function IdentifierForm({
  type,
  initialValue,
  error,
  retryAt,
  disabled,
  onChangeValue,
  onSubmit,
}: IdentifierFormProps): React.ReactNode {
  const form = useForm<IdentifierFormValues>({
    resolver: zodResolver(z.object({ value: identifierSchemas[type] })),
    defaultValues: { value: initialValue },
  });

  const retrySeconds = useCountdown(retryAt);
  const isRetryBlocked = retrySeconds !== null && retrySeconds > 0;
  const isDisabled = disabled || isRetryBlocked;

  const handleSubmit = form.handleSubmit(async ({ value }): Promise<void> => {
    await onSubmit(value);
  });

  const label = type === "email" ? "Email" : "Phone";
  const placeholder = type === "email" ? "example@mail.com" : "+1 555 123 4567";
  const autoComplete = type === "email" ? "email" : "tel";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Controller
        name="value"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="auth-identifier">{label}</FieldLabel>
            <Input
              {...field}
              id="auth-identifier"
              type={type === "email" ? "email" : "tel"}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
              onChange={(e) => {
                field.onChange(e);
                onChangeValue(e.target.value);
              }}
            />
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : error ? (
              <FieldError errors={[error]} />
            ) : null}
          </Field>
        )}
      />
      {isRetryBlocked && retrySeconds !== null && (
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          Retry in {formatCountdown(retrySeconds)}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isDisabled}>
        Continue
      </Button>
    </form>
  );
}

type IdentifierStepProps = {
  type: IdentityType;
  initialValue: string;
  error: Error | null;
  retryAt: string | null;
  disabled: boolean;
  onChangeValue: (value: string) => void;
  onChangeType: (type: IdentityType) => void;
  onSubmit: (value: string) => Promise<boolean>;
};

export function IdentifierStep({
  type,
  initialValue,
  error,
  retryAt,
  disabled,
  onChangeValue,
  onChangeType,
  onSubmit,
}: IdentifierStepProps): React.ReactNode {
  return (
    <div className="flex flex-col gap-6">
      <IdentityTabs value={type} onChange={onChangeType} disabled={disabled} />
      <IdentifierForm
        key={type}
        type={type}
        initialValue={initialValue}
        error={error}
        retryAt={retryAt}
        disabled={disabled}
        onChangeValue={onChangeValue}
        onSubmit={onSubmit}
      />
    </div>
  );
}
