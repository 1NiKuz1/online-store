import { NextResponse } from "next/server";

import { OtpInvalidCodeError, OtpTooManyAttemptsError } from "@domain/errors";

import { type Handler } from "../types";

export function withOtpErrorHandling(handler: Handler): Handler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof OtpInvalidCodeError) {
        return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
      }
      if (error instanceof OtpTooManyAttemptsError) {
        return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
      }
      throw error;
    }
  };
}
