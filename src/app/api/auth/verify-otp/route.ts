import { NextResponse } from "next/server";

import { extractIpAddress } from "@application/utils";
import { createPublicHandler } from "@common/api/factories";

import type { ClientInfo } from "@application/dto";
import type { VerifyOtpUseCase } from "@application/use-cases";

export const POST = createPublicHandler(async (req, context) => {
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
  const { user, sessionToken, maxAge } = await useCase.execute(body, clientInfo);

  const response = NextResponse.json({ user }, { status: 200 });

  response.cookies.set({
    name: "session_token",
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return response;
});
