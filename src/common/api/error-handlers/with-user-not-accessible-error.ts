import { NextResponse } from "next/server";

import { UserNotAccessibleError } from "@/domain/errors";

import type { Middleware } from "../types";

export const withUserNotAccessibleErrorHandling: Middleware = (handler) => async (req, context) => {
  try {
    return await handler(req, context);
  } catch (error) {
    if (error instanceof UserNotAccessibleError) {
      return NextResponse.json({ error: "User account is not accessible" }, { status: 403 });
    }
    throw error;
  }
};
