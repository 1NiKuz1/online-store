import type { SessionId } from "@domain/entities/types";
import type { ISessionRepository } from "@domain/repositories";

export type LogoutInput = {
  sessionId: SessionId;
};

export class LogoutUseCase {
  public constructor(private readonly sessionRepository: ISessionRepository) {}

  public async execute(input: LogoutInput): Promise<void> {
    const session = await this.sessionRepository.findById(input.sessionId);
    if (!session) {
      return;
    }
    await this.sessionRepository.revoke(session.id);
  }
}
