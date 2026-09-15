import { NextResponse } from "next/server";

import { createPublicHandler } from "@common/api/factories";

import type { RequestOtpUseCase } from "@application/use-cases";

export const POST = createPublicHandler(async (req, context) => {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const useCase = context.scope.resolve<RequestOtpUseCase>("requestOtpUseCase");
  const result = await useCase.execute(body);

  return NextResponse.json(result, { status: 200 });
});
