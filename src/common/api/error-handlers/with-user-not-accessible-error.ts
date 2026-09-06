import { NextResponse } from "next/server";

import { UserNotAccessibleError } from "@domain/errors";

import { type Handler } from "../types";

export function withUserNotAccessibleErrorHandling(handler: Handler): Handler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof UserNotAccessibleError) {
        return NextResponse.json({ error: "User account is not accessible" }, { status: 403 });
      }
      throw error;
    }
  };
}
