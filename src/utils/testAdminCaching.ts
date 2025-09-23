/**
 * Test script to verify admin dashboard caching
 */

import { adminCacheService } from '../services/adminCacheService';

export const testAdminCaching = () => {
  // Test 1: Check cache service
  adminCacheService.getStats();

  // Test 2: Simulate caching data
  const mockUsers = {
    users: [
      { id: 1, email: 'user1@example.com', full_name: 'User One', role: 'employee' },
      { id: 2, email: 'user2@example.com', full_name: 'User Two', role: 'hr' }
    ],
    pagination: { total: 2, page: 1, limit: 10, total_pages: 1 }
  };

  const mockEmployees = {
    employees: [
      { id: 1, employee_code: 'EMP001', full_name: 'Employee One', email: 'emp1@example.com' },
      { id: 2, employee_code: 'EMP002', full_name: 'Employee Two', email: 'emp2@example.com' }
    ],
    pagination: { total: 2, page: 1, limit: 10, total_pages: 1 }
  };

  const mockOrganizations = {
    organisations: [
      { id: 1, org_id: 'ORG001', org_name: 'Organization One', hr_email: 'hr1@example.com' },
      { id: 2, org_id: 'ORG002', org_name: 'Organization Two', hr_email: 'hr2@example.com' }
    ],
    pagination: { total: 2, page: 1, limit: 10, total_pages: 1 }
  };

  const mockAnalytics = {
    total_tests: 100,
    employee_tests: 80,
    recent_tests: 20,
    tests_by_type: [
      { type: 'phq9', count: 50 },
      { type: 'gad7', count: 30 },
      { type: 'pss10', count: 20 }
    ],
    tests_by_organization: [
      { org_id: 'ORG001', count: 60 },
      { org_id: 'ORG002', count: 40 }
    ],
    tests_by_severity: [
      { severity: 'low', count: 40 },
      { severity: 'moderate', count: 35 },
      { severity: 'high', count: 20 },
      { severity: 'severe', count: 5 }
    ]
  };

  // Cache the mock data using correct methods
  adminCacheService.setUsers(mockUsers);
  adminCacheService.setEmployees(mockEmployees);
  adminCacheService.setOrganizations(mockOrganizations);
  adminCacheService.setTestAnalytics(mockAnalytics);

  // Test 3: Verify cache retrieval
  adminCacheService.getUsers();
  adminCacheService.getEmployees();
  adminCacheService.getOrganizations();
  adminCacheService.getTestAnalytics();

  // Test 4: Final cache stats
  adminCacheService.getStats();
};

// Export for use in browser console
(window as any).testAdminCaching = testAdminCaching;