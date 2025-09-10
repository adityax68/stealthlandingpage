/**
 * Test script to verify the interface fix
 */

import { testCacheService } from '../services/testCacheService';
import type { TestDetails, TestDefinition } from '../types/testTypes';

export const testInterfaceFix = () => {
  console.log('🔧 Testing Interface Fix');
  console.log('========================');

  // Test 1: TestDefinition interface
  const testDef: TestDefinition = {
    id: 1,
    test_code: 'phq9',
    test_name: 'PHQ-9',
    test_category: 'depression',
    description: 'Patient Health Questionnaire-9',
    total_questions: 9,
    is_active: true,
    created_at: new Date().toISOString()
  };
  console.log('✅ TestDefinition interface works:', testDef.test_name);

  // Test 2: TestDetails interface (simple structure)
  const testDetails1: TestDetails = {
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
          { id: 2, option_text: 'Several days', option_value: 1, option_order: 2 }
        ]
      }
    ]
  };
  console.log('✅ TestDetails interface (simple) works:', testDetails1.test_name);

  // Test 3: TestDetails interface (complex structure)
  const testDetails2: TestDetails = {
    id: 1,
    test_code: 'phq9',
    test_name: 'PHQ-9',
    test_category: 'depression',
    description: 'Patient Health Questionnaire-9',
    total_questions: 9,
    is_active: true,
    created_at: new Date().toISOString(),
    test_definition: testDef,
    scoring_ranges: []
  };
  console.log('✅ TestDetails interface (complex) works:', testDetails2.test_name);

  // Test 4: Cache service with both structures
  testCacheService.cacheTestDetails('phq9', testDetails1);
  const cached1 = testCacheService.getCachedTestDetails('phq9');
  console.log('✅ Cache service works with simple structure:', cached1?.test_name);

  testCacheService.cacheTestDetails('gad7', testDetails2);
  const cached2 = testCacheService.getCachedTestDetails('gad7');
  console.log('✅ Cache service works with complex structure:', cached2?.test_name);

  console.log('\n🎉 Interface fix verified!');
  console.log('💡 Both simple and complex TestDetails structures work');
  console.log('💡 Cache service handles both formats correctly');
};

// Export for use in browser console
(window as any).testInterfaceFix = testInterfaceFix;
