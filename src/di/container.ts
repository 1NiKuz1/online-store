import { createContainer, InjectionMode, asValue, asClass, type AwilixContainer } from "awilix";

import { LogoutUseCase, RequestOtpUseCase, VerifyOtpUseCase } from "@application/use-cases";
import { db } from "@infrastructure/db/drizzle/client";
import { DrizzleUnitOfWork } from "@infrastructure/db/drizzle/unit-of-work";
import { DrizzleSessionRepository } from "@infrastructure/db/repositories/session.repository";
import { DrizzleUserIdentityRepository } from "@infrastructure/db/repositories/user-identity.repository";
import { DrizzleUserRepository } from "@infrastructure/db/repositories/user.repository";
import { ConsoleEmailService } from "@infrastructure/messages/email.service";
import { ConsoleSmsService } from "@infrastructure/messages/sms.service";
import { redis } from "@infrastructure/redis/client";
import { OtpService } from "@infrastructure/redis/services/otp.service";
import { RateLimiterService } from "@infrastructure/redis/services/rate-limiter.service";

// Persist the container on globalThis so Next.js HMR doesn't recreate it
// (and thus all singletons) on every code change in dev.
const globalForDi = globalThis as unknown as {
  container?: AwilixContainer;
};

export const container: AwilixContainer =
  globalForDi.container ??
  createContainer({
    injectionMode: InjectionMode.CLASSIC,
    strict: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDi.container = container;
}

container.register({
  // Clients
  db: asValue(db),
  redis: asValue(redis),

  unitOfWork: asClass(DrizzleUnitOfWork).singleton(),

  // Services
  otpService: asClass(OtpService).singleton(),
  rateLimiterService: asClass(RateLimiterService).singleton(),
  emailService: asClass(ConsoleEmailService).singleton(),
  smsService: asClass(ConsoleSmsService).singleton(),

  // Repositories
  userRepository: asClass(DrizzleUserRepository).singleton(),
  userIdentityRepository: asClass(DrizzleUserIdentityRepository).singleton(),
  sessionRepository: asClass(DrizzleSessionRepository).singleton(),

  // Use-cases
  requestOtpUseCase: asClass(RequestOtpUseCase).transient(),
  verifyOtpUseCase: asClass(VerifyOtpUseCase).transient(),
  logoutUseCase: asClass(LogoutUseCase).transient(),
});
