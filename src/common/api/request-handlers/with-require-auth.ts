import { NextResponse } from "next/server";

import type { AuthRequestContext, Middleware, RequiredAuthRequestContext } from "../types";

export const withRequireAuth: Middleware<RequiredAuthRequestContext, AuthRequestContext> =
  (handler) => async (req, context) => {
    const { sessionId, userId } = context.auth;

    if (!sessionId || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req, {
      ...context,
      auth: { sessionId, userId },
    });
  };
