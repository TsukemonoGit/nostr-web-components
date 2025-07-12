// src/types/cache.ts
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface NostrCache {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
  has(key: string): boolean;
  size(): number;
}
