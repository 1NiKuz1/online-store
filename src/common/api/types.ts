import type { NonNullableFields } from "../types";
import type { SessionId, UserId } from "@domain/entities";
import type { AwilixContainer } from "awilix";
import type { NextRequest, NextResponse } from "next/server";

export interface RequestContext {
  scope: AwilixContainer;
}

export interface AuthContext {
  sessionId: SessionId | null;
  userId: UserId | null;
}

export type RequiredAuthContext = NonNullableFields<AuthContext>;

export interface AuthRequestContext extends RequestContext {
  auth: AuthContext;
}

export interface RequiredAuthRequestContext extends RequestContext {
  auth: RequiredAuthContext;
}

export type NextHandler = (req: NextRequest) => Promise<NextResponse>;

export type Handler<HandlerContext = RequestContext> = (
  req: NextRequest,
  context: HandlerContext
) => Promise<NextResponse>;

export type Middleware<InnerContext = RequestContext, OuterContext = InnerContext> = (
  handler: Handler<InnerContext>
) => Handler<OuterContext>;
