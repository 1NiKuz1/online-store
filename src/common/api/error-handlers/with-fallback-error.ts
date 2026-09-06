import { NextResponse } from "next/server";

import { DomainError } from "@domain/errors";

import { type Handler } from "../types";

export function withFallbackErrorHandling(handler: Handler): Handler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof DomainError) {
        return NextResponse.json({ error: error.message }, { status: 422 });
      }

      console.error("Unhandled error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}
