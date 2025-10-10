// API Configuration
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

// API configuration

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/v1/auth/signup`,
  GOOGLE_OAUTH: `${API_BASE_URL}/api/v1/auth/google`,  // NEW: Google OAuth endpoint
  ME: `${API_BASE_URL}/api/v1/auth/me`,
  REFRESH: `${API_BASE_URL}/api/v1/auth/refresh`,
  REVOKE: `${API_BASE_URL}/api/v1/auth/revoke`,
  REVOKE_ALL: `${API_BASE_URL}/api/v1/auth/revoke-all`,
  TOKEN_STATUS: `${API_BASE_URL}/api/v1/auth/token-status`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/v1/auth/reset-password`,
  // Email verification endpoints
  VERIFY_EMAIL: `${API_BASE_URL}/api/v1/email-verification/verify`,
  RESEND_VERIFICATION: `${API_BASE_URL}/api/v1/email-verification/resend`,
  VERIFICATION_STATUS: `${API_BASE_URL}/api/v1/email-verification/status`,
  CLINICAL_ASSESSMENTS: `${API_BASE_URL}/api/v1/clinical/my-assessments`,
  UNIFIED_ASSESSMENTS: `${API_BASE_URL}/api/v1/clinical/unified-assessments`,
  COMPREHENSIVE_ASSESSMENT: `${API_BASE_URL}/api/v1/clinical/comprehensive-assessment`,
  QUESTIONS: `${API_BASE_URL}/api/v1/clinical/questions`,
  // Additional endpoints
  QUESTIONS_PHQ9: `${API_BASE_URL}/api/v1/clinical/questions/phq9`,
  QUESTIONS_GAD7: `${API_BASE_URL}/api/v1/clinical/questions/gad7`,
  QUESTIONS_PSS10: `${API_BASE_URL}/api/v1/clinical/questions/pss10`,
  CLINICAL_COMPREHENSIVE: `${API_BASE_URL}/api/v1/clinical/comprehensive`,
  CLINICAL_ASSESS: `${API_BASE_URL}/api/v1/clinical/assess`,
  // New Test System endpoints
  TESTS_DEFINITIONS: `${API_BASE_URL}/api/v1/tests/definitions`,
  TESTS_DETAILS: `${API_BASE_URL}/api/v1/tests/definitions`,
  TESTS_CATEGORIES: `${API_BASE_URL}/api/v1/tests/categories`,
  TESTS_ASSESS: `${API_BASE_URL}/api/v1/tests/assess`,
  TESTS_ASSESSMENTS: `${API_BASE_URL}/api/v1/tests/assessments`,
  // Chat endpoints
  CHAT_SEND: `${API_BASE_URL}/api/v1/chat/send`,
  CHAT_CONVERSATIONS: `${API_BASE_URL}/api/v1/chat/conversations`,
  CHAT_MESSAGES: `${API_BASE_URL}/api/v1/chat/conversations`,
  CHAT_UPLOAD: `${API_BASE_URL}/api/v1/chat/upload`,
  CHAT_FILES: `${API_BASE_URL}/api/v1/chat/files`,
  // Access request endpoints
  ACCESS_REQUEST: `${API_BASE_URL}/api/v1/access/request`,
  ACCESS_REQUEST_EMPLOYEE: `${API_BASE_URL}/api/v1/access/request-employee`,
  // HR endpoints
  HR_EMPLOYEES: `${API_BASE_URL}/api/v1/hr/employees`,
  HR_UPDATE_EMPLOYEE_STATUS: `${API_BASE_URL}/api/v1/hr/employees`,
  HR_EMPLOYEE_ASSESSMENTS: `${API_BASE_URL}/api/v1/hr/employees`,
  HR_EMPLOYEE_COMPLAINTS: `${API_BASE_URL}/api/v1/hr/employees`,
  HR_BULK_EMPLOYEE_ACCESS: `${API_BASE_URL}/api/v1/hr/bulk-employee-access`,
  
  // Complaints endpoints
  COMPLAINTS_CREATE: `${API_BASE_URL}/api/v1/complaints`,
  COMPLAINTS_MY_COMPLAINTS: `${API_BASE_URL}/api/v1/complaints/my-complaints`,
  COMPLAINTS_RESOLVE: `${API_BASE_URL}/api/v1/complaints`,
  COMPLAINTS_HR_ALL: `${API_BASE_URL}/api/v1/complaints/hr/all-complaints`,
  
  // Admin endpoints
  ADMIN_STATS: `${API_BASE_URL}/api/v1/admin/stats`,
  ADMIN_MONTHLY_USERS: `${API_BASE_URL}/api/v1/admin/weekly-users`,
  ADMIN_TEST_ANALYTICS: `${API_BASE_URL}/api/v1/admin/test-analytics`,
  ADMIN_USERS: `${API_BASE_URL}/api/v1/admin/users`,
  ADMIN_USERS_SEARCH: `${API_BASE_URL}/api/v1/admin/users/search`,
  ADMIN_EMPLOYEES: `${API_BASE_URL}/api/v1/admin/employees`,
  ADMIN_EMPLOYEES_SEARCH: `${API_BASE_URL}/api/v1/admin/employees/search`,
  ADMIN_ORGANISATIONS: `${API_BASE_URL}/api/v1/admin/organisations`,
  ADMIN_ORGANISATIONS_SEARCH: `${API_BASE_URL}/api/v1/admin/organisations/search`,
  
  // Research endpoints
  RESEARCHES: `${API_BASE_URL}/api/v1/researches`,
  ADMIN_RESEARCHES: `${API_BASE_URL}/api/v1/admin/researches`,
}

export default API_BASE_URL 