import { NextResponse } from "next/server";

import { RateLimitExceededError } from "@domain/errors/rate-limit-error";

import { type Handler } from "../types";

export function withRateLimitErrorHandling(handler: Handler): Handler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
      throw error;
    }
  };
}
