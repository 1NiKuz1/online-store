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
import { withAuth, withRequestScope } from "../request-handlers";

import type { AuthRequestContext, Handler, NextHandler, RequestContext } from "../types";

export const withStandardErrorHandling = compose(
  withFallbackErrorHandling,
  withZodErrorHandling,
  withInvariantViolationErrorHandling,
  withTransactionErrorHandling
);

export const withAuthErrorHandling = compose(
  withStandardErrorHandling,
  withOtpErrorHandling,
  withRateLimitErrorHandling,
  withUserNotAccessibleErrorHandling
);

export function createAuthHandler(handler: Handler<RequestContext>): NextHandler {
  const withError = withAuthErrorHandling(handler);
  return withRequestScope(withError);
}

export function createProtectedHandler(handler: Handler<AuthRequestContext>): NextHandler {
  const withAuthHandler = withAuth(handler);
  const withError = withAuthErrorHandling(withAuthHandler);
  return withRequestScope(withError);
}
