import { NextResponse } from "next/server";

import { OtpCodeNotFoundError, OtpInvalidCodeError, OtpTooManyAttemptsError } from "@domain/errors";

import { type Middleware } from "../types";

export const withOtpErrorHandling: Middleware = (handler) => async (req, context) => {
  try {
    return await handler(req, context);
  } catch (error) {
    if (error instanceof OtpCodeNotFoundError) {
      return NextResponse.json({ error: "OTP expired or not found" }, { status: 400 });
    }
    if (error instanceof OtpInvalidCodeError) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }
    if (error instanceof OtpTooManyAttemptsError) {
      return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
    }
    throw error;
  }
};
