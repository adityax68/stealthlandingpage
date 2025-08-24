// Mock API responses for testing authentication flow
// This file helps test the frontend while backend is being built

export const mockApiResponses = {
  // Organization signup response
  organizationSignup: {
    access_token: "mock_jwt_token_organization_12345",
    user: {
      id: "org_uuid_123",
      company_name: "Test Company",
      hremail: "hr@testcompany.com",
      role: "organization_hr"
    }
  },

  // Organization login response
  organizationLogin: {
    access_token: "mock_jwt_token_organization_12345",
    user: {
      id: "org_uuid_123",
      company_name: "Test Company",
      hremail: "hr@testcompany.com",
      role: "organization_hr"
    }
  },

  // Employee signup response
  employeeSignup: {
    access_token: "mock_jwt_token_employee_67890",
    user: {
      id: "emp_uuid_456",
      company_id: "org_uuid_123",
      employee_email: "john@testcompany.com",
      name: "John Doe",
      role: "employee"
    }
  },

  // Employee login response
  employeeLogin: {
    access_token: "mock_jwt_token_employee_67890",
    user: {
      id: "emp_uuid_456",
      company_id: "org_uuid_123",
      employee_email: "john@testcompany.com",
      name: "John Doe",
      role: "employee"
    }
  }
}

// Instructions for testing:
// 1. Replace the fetch calls in App.tsx with these mock responses
// 2. This will allow you to test the complete authentication flow
// 3. Users will be redirected to /dashboard after successful auth
// 4. Remove mock responses once backend is ready
