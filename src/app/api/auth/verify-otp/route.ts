import { NextResponse } from "next/server";

import { extractIpAddress } from "@application/utils";
import { createAuthHandler } from "@common/api/factories";

import type { ClientInfo } from "@application/dto";
import type { VerifyOtpUseCase } from "@application/use-cases";

export const POST = createAuthHandler(async (req, context) => {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const clientInfo: ClientInfo = {
    ipAddress: extractIpAddress(req.headers),
    userAgent: req.headers.get("user-agent"),
  };
  const useCase = context.scope.resolve<VerifyOtpUseCase>("verifyOtpUseCase");
  const result = await useCase.execute(body, clientInfo);

  const response = NextResponse.json(result, { status: 200 });

  response.cookies.set({
    name: "session_token",
    value: result.sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: result.maxAge,
  });

  return response;
});
