import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { type Handler } from "../types";

export function withZodErrorHandling(handler: Handler): Handler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation error", details: error.issues },
          { status: 400 }
        );
      }
      throw error;
    }
  };
}
