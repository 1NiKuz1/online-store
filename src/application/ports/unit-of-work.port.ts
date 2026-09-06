import type {
  ISessionRepository,
  IUserIdentityRepository,
  IUserRepository,
} from "@domain/repositories";

export type TransactionCallback<T> = (tx: TransactionContext) => Promise<T>;

export interface IUnitOfWork {
  /**
   * Runs `callback` inside a single SQL transaction.
   * @param operation human-readable name used for diagnostics of wrapped errors.
   */
  transaction<T>(operation: string, callback: TransactionCallback<T>): Promise<T>;
}

export interface TransactionContext {
  userRepository: IUserRepository;
  userIdentityRepository: IUserIdentityRepository;
  sessionRepository: ISessionRepository;
}
