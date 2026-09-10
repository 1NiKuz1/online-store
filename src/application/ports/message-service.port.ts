/** Common interface for message delivery services (email, SMS, push, etc.). */
export interface IMessageService {
  send(to: string, content: string): Promise<void>;
}
