import { NextResponse } from "next/server";
import { ZodError } from "zod";

import type { Middleware } from "../types";

export const withZodErrorHandling: Middleware = (handler) => async (req, context) => {
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
