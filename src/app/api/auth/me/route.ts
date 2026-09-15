import { NextResponse } from "next/server";

import { createProtectedHandler } from "@common/api/factories";

import type { CurrentUserUseCase } from "@application/use-cases";

export const GET = createProtectedHandler(async (req, context) => {
  const useCase = context.scope.resolve<CurrentUserUseCase>("currentUserUseCase");
  const user = await useCase.execute(context.auth.userId);
  return NextResponse.json({ user }, { status: 200 });
});
