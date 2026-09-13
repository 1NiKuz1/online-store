export interface CacheSetOptions {
  ttlSeconds?: number;
}

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void>;
  delete(key: string): Promise<void>;
  getOrSet<T>(
    key: string,
    factory: () => Promise<T | null>,
    options?: CacheSetOptions
  ): Promise<T | null>;
}
