/**
 * Demo script to test the browser cache functionality
 * This can be run in the browser console to test caching
 */

import { testCacheService } from '../services/testCacheService';

export const testCacheDemo = () => {
  console.log('🧪 Testing Browser Cache Service');
  console.log('================================');

  // Test 1: Cache test categories
  console.log('\n1. Testing Test Categories Cache');
  const categories = ['depression', 'anxiety', 'stress', 'wellness'];
  testCacheService.cacheTestCategories(categories);
  
  const cachedCategories = testCacheService.getCachedTestCategories();
  console.log('✅ Cached categories:', cachedCategories);
  console.log('✅ Cache hit:', cachedCategories !== null);

  // Test 2: Cache test definitions
  console.log('\n2. Testing Test Definitions Cache');
  const testDefinitions = [
    {
      id: 1,
      test_code: 'phq9',
      test_name: 'PHQ-9',
      test_category: 'depression',
      description: 'Patient Health Questionnaire-9',
      total_questions: 9,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      test_code: 'gad7',
      test_name: 'GAD-7',
      test_category: 'anxiety',
      description: 'Generalized Anxiety Disorder-7',
      total_questions: 7,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];
  
  testCacheService.cacheTestDefinitions(testDefinitions);
  const cachedDefinitions = testCacheService.getCachedTestDefinitions();
  console.log('✅ Cached definitions:', cachedDefinitions?.length, 'tests');
  console.log('✅ Cache hit:', cachedDefinitions !== null);

  // Test 3: Cache test details
  console.log('\n3. Testing Test Details Cache');
  const testDetails = {
    id: 1,
    test_code: 'phq9',
    test_name: 'PHQ-9',
    test_category: 'depression',
    description: 'Patient Health Questionnaire-9',
    total_questions: 9,
    is_active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        id: 1,
        question_text: 'Little interest or pleasure in doing things',
        question_order: 1,
        options: [
          { id: 1, option_text: 'Not at all', option_value: 0, option_order: 1 },
          { id: 2, option_text: 'Several days', option_value: 1, option_order: 2 },
          { id: 3, option_text: 'More than half the days', option_value: 2, option_order: 3 },
          { id: 4, option_text: 'Nearly every day', option_value: 3, option_order: 4 }
        ]
      }
    ]
  };
  
  testCacheService.cacheTestDetails('phq9', testDetails);
  const cachedDetails = testCacheService.getCachedTestDetails('phq9');
  console.log('✅ Cached test details for PHQ-9:', cachedDetails?.test_name);
  console.log('✅ Questions cached:', cachedDetails?.questions?.length, 'questions');
  console.log('✅ Cache hit:', cachedDetails !== null);

  // Test 4: Recent tests functionality
  console.log('\n4. Testing Recent Tests');
  const recentTests = testCacheService.getRecentTests();
  console.log('✅ Recent tests count:', recentTests.length);
  console.log('✅ Recent tests:', recentTests.map(t => t.test_name));

  // Test 5: Cache statistics
  console.log('\n5. Cache Statistics');
  const stats = testCacheService.getCacheStats();
  console.log('✅ Total entries:', stats.totalEntries);
  console.log('✅ Cache size:', stats.cacheSize, 'KB');
  console.log('✅ Recent tests:', stats.recentTestsCount);
  console.log('✅ Categories cached:', stats.categoriesCached);
  console.log('✅ Definitions cached:', stats.definitionsCached);

  // Test 6: Cache invalidation
  console.log('\n6. Testing Cache Invalidation');
  testCacheService.clearTestCache('phq9');
  const clearedDetails = testCacheService.getCachedTestDetails('phq9');
  console.log('✅ PHQ-9 cache cleared:', clearedDetails === null);

  console.log('\n🎉 Cache Demo Complete!');
  console.log('💡 Check localStorage for cached data');
  console.log('💡 Try refreshing the page to see cache persistence');
};

// Export for use in browser console
(window as any).testCacheDemo = testCacheDemo;
