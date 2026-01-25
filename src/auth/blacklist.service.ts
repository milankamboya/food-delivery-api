import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class BlacklistService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async blacklistToken(token: string, ttlSeconds: number): Promise<void> {
    // TTL in milliseconds
    const ttl = Math.max(0, ttlSeconds * 1000);
    await this.cacheManager.set(token, 'true', ttl);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const value = await this.cacheManager.get(token);
    return !!value;
  }
}
