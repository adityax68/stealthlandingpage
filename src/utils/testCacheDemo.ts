/**
 * Test script to demonstrate browser cache service
 */

import { testCacheService } from '../services/testCacheService';

export const testCacheDemo = () => {
  // Test 1: Cache test categories
  const categories = ['depression', 'anxiety', 'stress', 'wellness'];
  testCacheService.cacheTestCategories(categories);
  testCacheService.getCachedTestCategories();

  // Test 2: Cache test definitions
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
  testCacheService.getCachedTestDefinitions();

  // Test 3: Cache test details
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
  testCacheService.getCachedTestDetails('phq9');

  // Test 4: Recent tests functionality
  testCacheService.getRecentTests();

  // Test 5: Cache statistics
  testCacheService.getCacheStats();

  // Test 6: Cache invalidation
  testCacheService.clearTestCache('phq9');
  testCacheService.getCachedTestDetails('phq9');
};

// Export for use in browser console
(window as any).testCacheDemo = testCacheDemo;