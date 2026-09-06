import { NextResponse } from "next/server";

import { InvariantViolationError } from "@domain/errors";

import { type Handler } from "../types";

export function withInvariantViolationErrorHandling(handler: Handler): Handler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof InvariantViolationError) {
        console.error("[InvariantViolationError]", {
          kind: error.kind,
          message: error.message,
          context: error.context,
        });
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
      throw error;
    }
  };
}
