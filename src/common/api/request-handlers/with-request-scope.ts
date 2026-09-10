import { container } from "@di/container";

import type { Handler, NextHandler, RequestContext } from "../types";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Creates a request-scoped Awilix container and passes it to the handler.
 * Use `scope.resolve` (never the root `container.resolve`) for any
 * dependency that may be registered as `scoped()` or `transient()`.
 */
export function withRequestScope(handler: Handler): NextHandler {
  return async (req: NextRequest): Promise<NextResponse> => {
    const scope = container.createScope();
    const context: RequestContext = { scope };
    return handler(req, context);
  };
}
