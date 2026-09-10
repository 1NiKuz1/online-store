import { NextResponse } from "next/server";

import { InvariantViolationError } from "@domain/errors";

import { type Middleware } from "../types";

export const withInvariantViolationErrorHandling: Middleware =
  (handler) => async (req, context) => {
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
