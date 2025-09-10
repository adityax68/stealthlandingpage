/**
 * Browser-side caching service for test data
 * Caches test categories, definitions, and recently used test questions/options
 */

import type { TestDefinition, TestDetails, TestQuestions } from '../types/testTypes';

// Re-export types for backward compatibility
export type { TestDefinition, TestDetails, TestQuestions };

class TestCacheService {
  private readonly CACHE_PREFIX = 'health_app_test_cache_';
  private readonly CACHE_VERSION = '1.0';
  
  // Cache TTL in milliseconds
  private readonly CACHE_TTL = {
    TEST_CATEGORIES: 24 * 60 * 60 * 1000, // 24 hours
    TEST_DEFINITIONS: 24 * 60 * 60 * 1000, // 24 hours
    TEST_DETAILS: 12 * 60 * 60 * 1000, // 12 hours
    TEST_QUESTIONS: 6 * 60 * 60 * 1000, // 6 hours
    RECENT_TESTS: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  private readonly MAX_RECENT_TESTS = 4;

  /**
   * Generate cache key with version
   */
  private getCacheKey(key: string): string {
    return `${this.CACHE_PREFIX}${this.CACHE_VERSION}_${key}`;
  }

  /**
   * Check if cache entry is valid
   */
  private isCacheValid(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp < ttl;
  }

  /**
   * Get cached data if valid
   */
  private getCachedData<T>(key: string, ttl: number): T | null {
    try {
      const cacheKey = this.getCacheKey(key);
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      
      if (!this.isCacheValid(timestamp, ttl)) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  /**
   * Set cached data with timestamp
   */
  private setCachedData<T>(key: string, data: T): void {
    try {
      const cacheKey = this.getCacheKey(key);
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }

  /**
   * Cache test categories
   */
  cacheTestCategories(categories: string[]): void {
    this.setCachedData('test_categories', categories);
  }

  /**
   * Get cached test categories
   */
  getCachedTestCategories(): string[] | null {
    return this.getCachedData<string[]>('test_categories', this.CACHE_TTL.TEST_CATEGORIES);
  }

  /**
   * Cache test definitions
   */
  cacheTestDefinitions(definitions: TestDefinition[]): void {
    this.setCachedData('test_definitions', definitions);
  }

  /**
   * Get cached test definitions
   */
  getCachedTestDefinitions(): TestDefinition[] | null {
    return this.getCachedData<TestDefinition[]>('test_definitions', this.CACHE_TTL.TEST_DEFINITIONS);
  }

  /**
   * Cache test details (including questions and options)
   */
  cacheTestDetails(testCode: string, details: TestDetails): void {
    this.setCachedData(`test_details_${testCode}`, details);
    this.addToRecentTests(testCode, details);
  }

  /**
   * Get cached test details
   */
  getCachedTestDetails(testCode: string): TestDetails | null {
    return this.getCachedData<TestDetails>(`test_details_${testCode}`, this.CACHE_TTL.TEST_DETAILS);
  }

  /**
   * Cache test questions and options
   */
  cacheTestQuestions(testCode: string, questions: TestQuestions): void {
    this.setCachedData(`test_questions_${testCode}`, questions);
  }

  /**
   * Get cached test questions
   */
  getCachedTestQuestions(testCode: string): TestQuestions | null {
    return this.getCachedData<TestQuestions>(`test_questions_${testCode}`, this.CACHE_TTL.TEST_QUESTIONS);
  }

  /**
   * Add test to recent tests list
   */
  private addToRecentTests(testCode: string, details: TestDetails): void {
    try {
      const recentTests = this.getRecentTests();
      
      // Remove if already exists
      const filtered = recentTests.filter(test => test.test_code !== testCode);
      
      // Add to beginning
      const updated = [details, ...filtered].slice(0, this.MAX_RECENT_TESTS);
      
      this.setCachedData('recent_tests', updated);
    } catch (error) {
      console.error('Error updating recent tests:', error);
    }
  }

  /**
   * Get recently used tests
   */
  getRecentTests(): TestDetails[] {
    return this.getCachedData<TestDetails[]>('recent_tests', this.CACHE_TTL.RECENT_TESTS) || [];
  }

  /**
   * Get cached test details for recent tests
   */
  getRecentTestDetails(): TestDetails[] {
    const recentTests = this.getRecentTests();
    return recentTests.filter(test => 
      this.getCachedData<TestDetails>(`test_details_${test.test_code}`, this.CACHE_TTL.TEST_DETAILS) !== null
    );
  }

  /**
   * Clear all test cache
   */
  clearAllCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Clear cache for specific test
   */
  clearTestCache(testCode: string): void {
    try {
      const keys = [
        `test_details_${testCode}`,
        `test_questions_${testCode}`,
      ];
      
      keys.forEach(key => {
        localStorage.removeItem(this.getCacheKey(key));
      });
      
      // Remove from recent tests
      const recentTests = this.getRecentTests();
      const filtered = recentTests.filter(test => test.test_code !== testCode);
      this.setCachedData('recent_tests', filtered);
    } catch (error) {
      console.error('Error clearing test cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalEntries: number;
    cacheSize: number;
    recentTestsCount: number;
    categoriesCached: boolean;
    definitionsCached: boolean;
  } {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      let cacheSize = 0;
      cacheKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          cacheSize += value.length;
        }
      });
      
      const recentTests = this.getRecentTests();
      const categoriesCached = this.getCachedTestCategories() !== null;
      const definitionsCached = this.getCachedTestDefinitions() !== null;
      
      return {
        totalEntries: cacheKeys.length,
        cacheSize: Math.round(cacheSize / 1024), // KB
        recentTestsCount: recentTests.length,
        categoriesCached,
        definitionsCached,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        totalEntries: 0,
        cacheSize: 0,
        recentTestsCount: 0,
        categoriesCached: false,
        definitionsCached: false,
      };
    }
  }

  /**
   * Preload frequently used tests
   */
  async preloadFrequentTests(testCodes: string[], fetchFunction: (testCode: string) => Promise<TestDetails>): Promise<void> {
    try {
      const promises = testCodes.map(async (testCode) => {
        const cached = this.getCachedTestDetails(testCode);
        if (!cached) {
          try {
            const details = await fetchFunction(testCode);
            this.cacheTestDetails(testCode, details);
          } catch (error) {
            console.warn(`Failed to preload test ${testCode}:`, error);
          }
        }
      });
      
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Error preloading tests:', error);
    }
  }
}

// Export singleton instance
export const testCacheService = new TestCacheService();
export default testCacheService;
