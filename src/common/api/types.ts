import type { SessionId } from "@domain/entities";
import type { AwilixContainer } from "awilix";
import type { NextRequest, NextResponse } from "next/server";

export interface RequestContext {
  scope: AwilixContainer;
}

export interface AuthContext {
  sessionId: SessionId | null;
}

export interface AuthRequestContext extends RequestContext {
  auth: AuthContext;
}

export type NextHandler = (req: NextRequest) => Promise<NextResponse>;

export type Handler<HandlerContext = RequestContext> = (
  req: NextRequest,
  context: HandlerContext
) => Promise<NextResponse>;

export type Middleware<HandlerContextIn = RequestContext, HandlerContextOut = HandlerContextIn> = (
  handler: Handler<HandlerContextIn>
) => Handler<HandlerContextOut>;
