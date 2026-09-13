import { createSha256Hash } from "@common/utils";

import type { AuthContext, AuthRequestContext, Middleware, RequestContext } from "../types";
import type { ISessionService } from "@application/ports";

const SESSION_COOKIE_NAME = "session_token";

export const withAuth: Middleware<AuthRequestContext, RequestContext> =
  (handler) => async (req, context) => {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    let auth: AuthContext = { sessionId: null };

    if (token) {
      const tokenHash = createSha256Hash(token);
      const sessionService = context.scope.resolve<ISessionService>("sessionService");
      const session = await sessionService.findActiveByTokenHash(tokenHash);
      if (session) {
        auth = { sessionId: session.id };
      }
    }

    return handler(req, { ...context, auth });
  };
