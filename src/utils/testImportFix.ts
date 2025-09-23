/**
 * Test script to verify the import fix
 */

import { testCacheService } from '../services/testCacheService';
import type { TestDetails, TestDefinition } from '../types/testTypes';

export const testImportFix = () => {
  // Test 1: Direct import from types
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

  // Test 2: TestDetails interface
  const testDetails: TestDetails = {
    id: 1,
    test_code: 'phq9',
    test_name: 'PHQ-9',
    test_category: 'depression',
    description: 'Patient Health Questionnaire-9',
    total_questions: 9,
    is_active: true,
    created_at: new Date().toISOString(),
    questions: []
  };

  // Test 3: Cache service import
  testCacheService.getCachedTestDefinitions();
  
  // Use variables to avoid unused warnings
  return { testDef, testDetails };
};

// Export for use in browser console
(window as any).testImportFix = testImportFix;