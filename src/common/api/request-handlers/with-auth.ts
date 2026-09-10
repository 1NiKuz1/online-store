import { createSha256Hash } from "@common/utils";

import type { AuthContext, AuthRequestContext, Middleware, RequestContext } from "../types";
import type { ISessionRepository } from "@domain/repositories";

const SESSION_COOKIE_NAME = "session_token";

/**
 * Resolves the active session for the current request and stores
 * its `sessionId` in the enriched `auth` context. Never throws: an
 * anonymous request, an expired cookie, or an unknown token all
 * leave `auth.sessionId` as `null`, so this middleware can sit on
 * both protected and public routes (handlers decide what to do).
 *
 * Must be composed after `withRequestScope` so the session
 * repository can be resolved from the request-scoped container.
 */
export const withAuth: Middleware<AuthRequestContext, RequestContext> =
  (handler) => async (req, context) => {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    let auth: AuthContext = { sessionId: null };

    if (token) {
      const tokenHash = createSha256Hash(token);
      const sessionRepository = context.scope.resolve<ISessionRepository>("sessionRepository");
      const session = await sessionRepository.findByTokenHash(tokenHash);
      if (session) {
        auth = { sessionId: session.id };
      }
    }

    const enrichedContext: AuthRequestContext = { ...context, auth };
    return handler(req, enrichedContext);
  };
