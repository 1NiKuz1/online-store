"use client";

import { useCallback, useReducer, useState } from "react";

import { type IdentityType } from "@presentation/shared/api";
import { useCountdown } from "@presentation/shared/lib";

import { toAuthError, type AuthError } from "./auth-error";
import { useRequestOtp } from "./use-request-otp";
import { useVerifyOtp } from "./use-verify-otp";

export type AuthFlowState = {
  step: "identifier" | "otp";
  type: IdentityType;
  values: Record<IdentityType, string>;
  expiresAt: string | null;
};

type AuthFlowAction =
  | { type: "SET_IDENTITY_TYPE"; payload: IdentityType }
  | { type: "SET_VALUE"; payload: string }
  | { type: "OTP_ISSUED"; payload: { expiresAt: string } }
  | { type: "OTP_RESENT"; payload: { expiresAt: string } }
  | { type: "BACK_TO_IDENTIFIER" }
  | { type: "RESET" };

const createInitialState = (): AuthFlowState => ({
  step: "identifier",
  type: "email",
  values: { email: "", phone: "" },
  expiresAt: null,
});

function reducer(state: AuthFlowState, action: AuthFlowAction): AuthFlowState {
  switch (action.type) {
    case "SET_IDENTITY_TYPE":
      if (state.step !== "identifier" || state.type === action.payload) return state;
      return { ...state, type: action.payload };

    case "SET_VALUE":
      if (state.step !== "identifier") return state;
      if (state.values[state.type] === action.payload) return state;
      return { ...state, values: { ...state.values, [state.type]: action.payload } };

    case "OTP_ISSUED":
      if (state.step !== "identifier") return state;
      return { ...state, step: "otp", expiresAt: action.payload.expiresAt };

    case "OTP_RESENT":
      if (state.step !== "otp") return state;
      return { ...state, expiresAt: action.payload.expiresAt };

    case "BACK_TO_IDENTIFIER":
      if (state.step !== "otp") return state;
      return { ...state, step: "identifier", expiresAt: null };

    case "RESET":
      return createInitialState();
  }
}

type UseAuthFlowParams = { onVerified: () => void };

export type UseAuthFlowResult = {
  state: AuthFlowState;
  retryAt: string | null;
  error: Error | null;
  isSubmitting: boolean;
  setValue: (value: string) => void;
  setIdentityType: (type: IdentityType) => void;
  submitIdentifier: (value: string) => Promise<boolean>;
  submitOtp: (code: string) => Promise<boolean>;
  resendOtp: () => Promise<boolean>;
  backToIdentifier: () => void;
  clearError: () => void;
  reset: () => void;
};

export function useAuthFlow({ onVerified }: UseAuthFlowParams): UseAuthFlowResult {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  const currentValue = state.values[state.type];
  const isSubmitting = requestOtp.isPending || verifyOtp.isPending;

  const isCurrentError =
    authError !== null && authError.type === state.type && authError.value === currentValue;

  const retrySeconds = useCountdown(isCurrentError ? authError.retryAt : null);
  const retryAt =
    isCurrentError && retrySeconds !== null && retrySeconds > 0 ? authError.retryAt : null;
  const error = isCurrentError ? new Error(authError.message) : null;

  const clearError = useCallback((): void => {
    setAuthError(null);
  }, []);

  const recordError = useCallback(
    (e: unknown, key: { type: IdentityType; value: string }): void => {
      setAuthError(toAuthError(e, key));
    },
    []
  );

  const setValue = useCallback((value: string): void => {
    dispatch({ type: "SET_VALUE", payload: value });
  }, []);

  const setIdentityType = useCallback((type: IdentityType): void => {
    dispatch({ type: "SET_IDENTITY_TYPE", payload: type });
  }, []);

  const submitIdentifier = useCallback(
    async (value: string): Promise<boolean> => {
      clearError();
      try {
        const result = await requestOtp.mutateAsync({ type: state.type, value });
        dispatch({ type: "OTP_ISSUED", payload: { expiresAt: result.expiresAt } });
        return true;
      } catch (e) {
        recordError(e, { type: state.type, value });
        return false;
      }
    },
    [state.type, requestOtp, clearError, recordError]
  );

  const submitOtp = useCallback(
    async (code: string): Promise<boolean> => {
      if (state.step !== "otp") return false;
      clearError();
      const value = state.values[state.type];
      try {
        await verifyOtp.mutateAsync({ type: state.type, value, code });
        onVerified();
        dispatch({ type: "RESET" });
        return true;
      } catch (e) {
        recordError(e, { type: state.type, value });
        return false;
      }
    },
    [state, verifyOtp, onVerified, clearError, recordError]
  );

  const resendOtp = useCallback(async (): Promise<boolean> => {
    if (state.step !== "otp") return false;
    clearError();
    const value = state.values[state.type];
    try {
      const result = await requestOtp.mutateAsync({ type: state.type, value });
      dispatch({ type: "OTP_RESENT", payload: { expiresAt: result.expiresAt } });
      return true;
    } catch (e) {
      recordError(e, { type: state.type, value });
      return false;
    }
  }, [state, requestOtp, clearError, recordError]);

  const backToIdentifier = useCallback((): void => {
    clearError();
    dispatch({ type: "BACK_TO_IDENTIFIER" });
  }, [clearError]);

  const reset = useCallback((): void => {
    clearError();
    dispatch({ type: "RESET" });
  }, [clearError]);

  return {
    state,
    retryAt,
    error,
    isSubmitting,
    setValue,
    setIdentityType,
    submitIdentifier,
    submitOtp,
    resendOtp,
    backToIdentifier,
    clearError,
    reset,
  };
}
