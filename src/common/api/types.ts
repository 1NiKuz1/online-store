import type { AwilixContainer } from "awilix";
import type { NextRequest, NextResponse } from "next/server";

export interface RequestContext {
  scope: AwilixContainer;
}

export type Handler = (req: NextRequest, context: RequestContext) => Promise<NextResponse>;
export type Middleware = (handler: Handler) => Handler;
