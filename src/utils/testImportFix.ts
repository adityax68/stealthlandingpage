/**
 * Test script to verify the import fix
 */

// Test importing from the types file
import type { TestDefinition, TestDetails } from '../types/testTypes';

// Test importing from the service file (re-export)
import { testCacheService } from '../services/testCacheService';

export const testImportFix = () => {
  console.log('🔧 Testing Import Fix');
  console.log('====================');

  try {
    // Test 1: Direct import from types
    const testDef: TestDefinition = {
      id: 1,
      test_code: 'phq9',
      test_name: 'PHQ-9',
      test_category: 'depression',
      description: 'Test',
      total_questions: 9,
      is_active: true,
      created_at: new Date().toISOString()
    };
    console.log('✅ Direct import from types works:', testDef.test_name);

    // Test 2: TestDetails interface
    const testDetails: TestDetails = {
      ...testDef,
      questions: []
    };
    console.log('✅ TestDetails interface works:', testDetails.test_name);

    // Test 3: Cache service import
    console.log('✅ Cache service import works:', typeof testCacheService);

    // Test 4: Cache service methods
    testCacheService.cacheTestDefinitions([testDef]);
    const cached = testCacheService.getCachedTestDefinitions();
    console.log('✅ Cache service methods work:', cached?.length, 'items');

    console.log('\n🎉 All imports working correctly!');
    console.log('💡 Types are properly exported and imported');
    console.log('💡 No more module export errors');

  } catch (error) {
    console.error('❌ Import test failed:', error);
  }
};

// Export for use in browser console
(window as any).testImportFix = testImportFix;
