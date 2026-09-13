import type { ISessionService } from "../ports";
import type { SessionId } from "@domain/entities";

export type LogoutInput = {
  sessionId: SessionId;
};

export class LogoutUseCase {
  public constructor(private readonly sessionService: ISessionService) {}

  public async execute(input: LogoutInput): Promise<void> {
    await this.sessionService.revoke(input.sessionId);
  }
}
