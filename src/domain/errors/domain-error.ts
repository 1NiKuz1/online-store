/**
 * Base class for all domain errors.
 * Specialized errors extend this class.
 */
export abstract class DomainError extends Error {
  public readonly name: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
