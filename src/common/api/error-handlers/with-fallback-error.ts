import { NextResponse } from "next/server";

import { DomainError } from "@domain/errors";

import { type Middleware } from "../types";

export const withFallbackErrorHandling: Middleware = (handler) => async (req, context) => {
  try {
    return await handler(req, context);
  } catch (error) {
    if (error instanceof DomainError) {
      console.error("[UnhandledDomainError] Every DomainError must have a specific handler", {
        name: error.name,
        message: error.message,
      });
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    console.error("Unhandled error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
