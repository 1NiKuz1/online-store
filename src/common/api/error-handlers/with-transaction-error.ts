import { NextResponse } from "next/server";

import { TransactionFailedError } from "@domain/errors";

import type { Middleware } from "../types";

export const withTransactionErrorHandling: Middleware = (handler) => async (req, context) => {
  try {
    return await handler(req, context);
  } catch (error) {
    if (error instanceof TransactionFailedError) {
      return NextResponse.json({ error: "Database transaction failed" }, { status: 503 });
    }
    throw error;
  }
};
