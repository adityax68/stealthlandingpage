// API Configuration
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

// Debug logging
console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('Final API_BASE_URL:', API_BASE_URL)

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/v1/auth/signup`,
  ME: `${API_BASE_URL}/api/v1/auth/me`,
  CLINICAL_ASSESSMENTS: `${API_BASE_URL}/api/v1/clinical/my-assessments`,
  COMPREHENSIVE_ASSESSMENT: `${API_BASE_URL}/api/v1/clinical/comprehensive-assessment`,
  QUESTIONS: `${API_BASE_URL}/api/v1/clinical/questions`,
  // Additional endpoints
  QUESTIONS_PHQ9: `${API_BASE_URL}/api/v1/clinical/questions/phq9`,
  QUESTIONS_GAD7: `${API_BASE_URL}/api/v1/clinical/questions/gad7`,
  QUESTIONS_PSS10: `${API_BASE_URL}/api/v1/clinical/questions/pss10`,
  CLINICAL_COMPREHENSIVE: `${API_BASE_URL}/api/v1/clinical/comprehensive`,
  CLINICAL_ASSESS: `${API_BASE_URL}/api/v1/clinical/assess`,
}

export default API_BASE_URL 