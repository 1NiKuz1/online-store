import { NextResponse } from "next/server";

import { RateLimitExceededError } from "@domain/errors";

import type { Middleware } from "../types";

export const withRateLimitErrorHandling: Middleware = (handler) => async (req, context) => {
  try {
    return await handler(req, context);
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: error.retryAfter },
        { status: 429 }
      );
    }
    throw error;
  }
};
