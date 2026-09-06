import type { IMessageService } from "@application/ports";

export class ConsoleEmailService implements IMessageService {
  public async send(to: string, content: string): Promise<void> {
    console.log(`[EMAIL] to=${to} content=${content}`);
  }
}
