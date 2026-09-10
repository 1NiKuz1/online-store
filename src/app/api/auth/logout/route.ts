import { NextResponse } from "next/server";

import { createProtectedHandler } from "@common/api";

import type { LogoutUseCase } from "@application/use-cases";

export const POST = createProtectedHandler(async (_req, context) => {
  if (context.auth.sessionId) {
    const useCase = context.scope.resolve<LogoutUseCase>("logoutUseCase");
    await useCase.execute({ sessionId: context.auth.sessionId });
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.delete("session_token");
  return response;
});
