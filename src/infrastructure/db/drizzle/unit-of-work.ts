import { DomainError, TransactionFailedError } from "@domain/errors";

import { DrizzleSessionRepository } from "../repositories/session.repository";
import { DrizzleUserIdentityRepository } from "../repositories/user-identity.repository";
import { DrizzleUserRepository } from "../repositories/user.repository";

import type { Database } from "./client";
import type { TransactionContext, IUnitOfWork, TransactionCallback } from "@application/ports";

export class DrizzleUnitOfWork implements IUnitOfWork {
  constructor(private readonly db: Database) {}

  async transaction<T>(operation: string, callback: TransactionCallback<T>): Promise<T> {
    try {
      return await this.db.transaction(async (tx) => {
        const transactionContext: TransactionContext = {
          userRepository: new DrizzleUserRepository(tx),
          userIdentityRepository: new DrizzleUserIdentityRepository(tx),
          sessionRepository: new DrizzleSessionRepository(tx),
        };
        return callback(transactionContext);
      });
    } catch (error) {
      // Domain errors (including TransactionFailedError itself) bubble up
      // untouched so the Presentation layer can map them to the right status.
      if (error instanceof DomainError) {
        throw error;
      }
      throw new TransactionFailedError(operation, error);
    }
  }
}
