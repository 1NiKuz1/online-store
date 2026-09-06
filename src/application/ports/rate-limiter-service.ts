export interface RateLimiterOptions {
  /** Maximum allowed requests in the window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
}

export interface IRateLimiterService {
  /** Fixed-window counter algorithm. Throws `RateLimitExceededError` when the limit is exceeded. */
  isAllowedFixedWindow(key: string, options: RateLimiterOptions): Promise<void>;
}
