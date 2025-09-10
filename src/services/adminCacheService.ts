/**
 * Frontend-side caching service for admin dashboard data
 * Works with the backend caching to provide instant tab switching
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class AdminCacheService {
  private readonly CACHE_PREFIX = 'admin_cache_';
  private readonly DEFAULT_TTL = 30 * 1000; // 30 seconds (matches backend)

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${this.CACHE_PREFIX}${endpoint}_${paramString}`;
  }

  private isCacheValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  get<T>(endpoint: string, params?: Record<string, any>): T | null {
    try {
      const key = this.getCacheKey(endpoint, params);
      const cached = localStorage.getItem(key);
      
      if (!cached) return null;
      
      const entry: CacheEntry<T> = JSON.parse(cached);
      
      if (!this.isCacheValid(entry)) {
        localStorage.removeItem(key);
        return null;
      }
      
      return entry.data;
    } catch (error) {
      console.error('Error reading from admin cache:', error);
      return null;
    }
  }

  set<T>(endpoint: string, data: T, ttl: number = this.DEFAULT_TTL, params?: Record<string, any>): void {
    try {
      const key = this.getCacheKey(endpoint, params);
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('Error writing to admin cache:', error);
    }
  }

  clear(endpoint?: string): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          if (!endpoint || key.includes(endpoint)) {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Error clearing admin cache:', error);
    }
  }

  // Specific methods for admin endpoints
  getUsers(skip: number = 0, limit: number = 10) {
    return this.get('users', { skip, limit });
  }

  setUsers(data: any, skip: number = 0, limit: number = 10) {
    this.set('users', data, this.DEFAULT_TTL, { skip, limit });
  }

  getEmployees(skip: number = 0, limit: number = 10) {
    return this.get('employees', { skip, limit });
  }

  setEmployees(data: any, skip: number = 0, limit: number = 10) {
    this.set('employees', data, this.DEFAULT_TTL, { skip, limit });
  }

  getOrganizations(skip: number = 0, limit: number = 10) {
    return this.get('organizations', { skip, limit });
  }

  setOrganizations(data: any, skip: number = 0, limit: number = 10) {
    this.set('organizations', data, this.DEFAULT_TTL, { skip, limit });
  }

  getTestAnalytics() {
    return this.get('test-analytics');
  }

  setTestAnalytics(data: any) {
    this.set('test-analytics', data);
  }

  getAdminStats() {
    return this.get('admin-stats');
  }

  setAdminStats(data: any) {
    this.set('admin-stats', data, 60 * 1000); // 1 minute TTL for stats
  }

  getMonthlyUserData() {
    return this.get('monthly-user-data');
  }

  setMonthlyUserData(data: any) {
    this.set('monthly-user-data', data, 5 * 60 * 1000); // 5 minutes TTL for monthly data
  }

  // Cache statistics
  getStats() {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
    
    let totalSize = 0;
    let validEntries = 0;
    
    cacheKeys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry = JSON.parse(cached);
          if (this.isCacheValid(entry)) {
            validEntries++;
            totalSize += cached.length;
          }
        }
      } catch (error) {
        // Ignore invalid entries
      }
    });
    
    return {
      totalEntries: cacheKeys.length,
      validEntries,
      totalSize: Math.round(totalSize / 1024), // KB
      cacheKeys: cacheKeys.map(key => key.replace(this.CACHE_PREFIX, ''))
    };
  }
}

// Export singleton instance
export const adminCacheService = new AdminCacheService();
export default adminCacheService;
