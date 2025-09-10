/**
 * Type definitions for test-related data structures
 */

export interface TestDefinition {
  id: number;
  test_code: string;
  test_name: string;
  test_category: string;
  description: string;
  total_questions: number;
  is_active: boolean;
  created_at: string;
}

export interface TestDetails {
  id: number;
  test_code: string;
  test_name: string;
  test_category: string;
  description: string;
  total_questions: number;
  is_active: boolean;
  created_at: string;
  questions?: Array<{
    id: number;
    question_text: string;
    question_order: number;
    options: Array<{
      id: number;
      option_text: string;
      option_value: number;
      option_order: number;
    }>;
  }>;
  // Alternative structure for detailed test data
  test_definition?: TestDefinition;
  scoring_ranges?: any[];
}

export interface TestQuestions {
  questions: string[];
  response_options: string[];
}
