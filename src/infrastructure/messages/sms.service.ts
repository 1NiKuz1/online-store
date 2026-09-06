import type { IMessageService } from "@application/ports";

export class ConsoleSmsService implements IMessageService {
  public async send(to: string, content: string): Promise<void> {
    console.log(`[SMS] to=${to} content=${content}`);
  }
}
