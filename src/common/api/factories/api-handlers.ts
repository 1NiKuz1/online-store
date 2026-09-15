import { compose } from "../compose-handlers";
import {
  withFallbackErrorHandling,
  withInvariantViolationErrorHandling,
  withOtpErrorHandling,
  withRateLimitErrorHandling,
  withTransactionErrorHandling,
  withUserNotAccessibleErrorHandling,
  withZodErrorHandling,
} from "../error-handlers";
import { withAuth, withRequestScope, withRequireAuth } from "../request-handlers";

import type {
  AuthRequestContext,
  Handler,
  NextHandler,
  RequestContext,
  RequiredAuthRequestContext,
} from "../types";

export const withErrorHandling = compose(
  withFallbackErrorHandling,
  withZodErrorHandling,
  withInvariantViolationErrorHandling,
  withTransactionErrorHandling,
  withOtpErrorHandling,
  withRateLimitErrorHandling,
  withUserNotAccessibleErrorHandling
);

export function createPublicHandler(handler: Handler<RequestContext>): NextHandler {
  const withError = withErrorHandling(handler);
  return withRequestScope(withError);
}

export function createOptionalAuthHandler(handler: Handler<AuthRequestContext>): NextHandler {
  const withAuthHandler = withAuth(handler);
  const withError = withErrorHandling(withAuthHandler);
  return withRequestScope(withError);
}

export function createProtectedHandler(handler: Handler<RequiredAuthRequestContext>): NextHandler {
  const withRequireAuthHandler = withRequireAuth(handler);
  const withAuthHandler = withAuth(withRequireAuthHandler);
  const withError = withErrorHandling(withAuthHandler);
  return withRequestScope(withError);
}
