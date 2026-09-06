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
import { withRequestScope } from "../with-request-scope";

import type { Handler } from "../types";

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

export function createAuthHandler(handler: Handler): Handler {
  return compose(withAuthErrorHandling, withRequestScope)(handler);
}
