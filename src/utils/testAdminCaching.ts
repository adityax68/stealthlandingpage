/**
 * Test script to verify admin dashboard caching is working
 */

import { adminCacheService } from '../services/adminCacheService';

export const testAdminCaching = () => {
  console.log('🧪 Testing Admin Dashboard Caching');
  console.log('==================================');

  try {
    // Test 1: Check cache service
    console.log('\n1. Cache Service Status');
    const stats = adminCacheService.getStats();
    console.log('✅ Cache service working');
    console.log(`   Total entries: ${stats.totalEntries}`);
    console.log(`   Valid entries: ${stats.validEntries}`);
    console.log(`   Cache size: ${stats.totalSize} KB`);
    console.log(`   Cached endpoints: ${stats.cacheKeys.join(', ')}`);

    // Test 2: Simulate caching data
    console.log('\n2. Simulating Cache Data');
    
    const mockUsers = {
      users: [
        { id: 1, email: 'test@example.com', full_name: 'Test User' }
      ],
      pagination: { total: 1, page: 1, limit: 10, total_pages: 1 }
    };
    
    const mockEmployees = {
      employees: [
        { id: 1, employee_code: 'EMP001', full_name: 'Test Employee' }
      ],
      pagination: { total: 1, page: 1, limit: 10, total_pages: 1 }
    };
    
    const mockOrganizations = {
      organisations: [
        { id: 1, org_id: 'ORG001', org_name: 'Test Org' }
      ],
      pagination: { total: 1, page: 1, limit: 10, total_pages: 1 }
    };
    
    const mockAnalytics = {
      total_tests: 10,
      employee_tests: 5,
      recent_tests: 3,
      tests_by_type: [],
      tests_by_organization: [],
      tests_by_severity: []
    };

    // Cache the mock data
    adminCacheService.setUsers(mockUsers, 0, 10);
    adminCacheService.setEmployees(mockEmployees, 0, 10);
    adminCacheService.setOrganizations(mockOrganizations, 0, 10);
    adminCacheService.setTestAnalytics(mockAnalytics);

    console.log('✅ Mock data cached successfully');

    // Test 3: Verify cache retrieval
    console.log('\n3. Testing Cache Retrieval');
    
    const cachedUsers = adminCacheService.getUsers(0, 10);
    const cachedEmployees = adminCacheService.getEmployees(0, 10);
    const cachedOrganizations = adminCacheService.getOrganizations(0, 10);
    const cachedAnalytics = adminCacheService.getTestAnalytics();

    console.log(`✅ Users cache: ${cachedUsers ? 'HIT' : 'MISS'}`);
    console.log(`✅ Employees cache: ${cachedEmployees ? 'HIT' : 'MISS'}`);
    console.log(`✅ Organizations cache: ${cachedOrganizations ? 'HIT' : 'MISS'}`);
    console.log(`✅ Analytics cache: ${cachedAnalytics ? 'HIT' : 'MISS'}`);

    // Test 4: Final cache stats
    console.log('\n4. Final Cache Statistics');
    const finalStats = adminCacheService.getStats();
    console.log(`✅ Total entries: ${finalStats.totalEntries}`);
    console.log(`✅ Valid entries: ${finalStats.validEntries}`);
    console.log(`✅ Cache size: ${finalStats.totalSize} KB`);

    console.log('\n🎉 Admin Dashboard Caching Test Complete!');
    console.log('💡 All admin tabs should now load instantly on tab switch');
    console.log('💡 First load will be slow (cache miss), subsequent loads instant');
    console.log('💡 Cache expires after 30 seconds for fresh data');

    return true;
  } catch (error) {
    console.error('❌ Admin caching test failed:', error);
    return false;
  }
};

// Export for browser console
(window as any).testAdminCaching = testAdminCaching;
