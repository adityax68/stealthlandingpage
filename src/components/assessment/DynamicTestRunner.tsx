import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { API_ENDPOINTS } from '../../config/api'

interface TestQuestion {
  id: number
  question_number: number
  question_text: string
  is_reverse_scored: boolean
  options: TestQuestionOption[]
}

interface TestQuestionOption {
  id: number
  option_text: string
  option_value: number
  weight: number
  display_order: number
}

interface TestDefinition {
  id: number
  test_code: string
  test_name: string
  test_category: string
  description: string
  total_questions: number
  is_active: boolean
}

interface TestDetails {
  test_definition: TestDefinition
  questions: TestQuestion[]
  scoring_ranges: any[]
}

interface DynamicTestRunnerProps {
  testCode: string
  onComplete: (results: any) => void
  onBack: () => void
}

const DynamicTestRunner: React.FC<DynamicTestRunnerProps> = ({ 
  testCode, 
  onComplete, 
  onBack 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<{[key: number]: number}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testDetails, setTestDetails] = useState<TestDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTestDetails()
  }, [testCode])

  const loadTestDetails = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.TESTS_DEFINITIONS}/${testCode}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTestDetails(data)
      } else {
        throw new Error('Failed to load test details')
      }
    } catch (error) {
      console.error('Error loading test details:', error)
      setError('Failed to load test details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (optionId: number) => {
    const questionId = testDetails?.questions[currentQuestion]?.id
    if (questionId) {
      setResponses(prev => ({
        ...prev,
        [questionId]: optionId
      }))
    }
  }

  const handleNext = () => {
    if (currentQuestion < (testDetails?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (!testDetails) return

    setIsSubmitting(true)
    
    try {
      // Convert responses to the format expected by the API
      const apiResponses = Object.entries(responses).map(([questionId, optionId]) => ({
        question_id: parseInt(questionId),
        option_id: optionId
      }))

      const response = await fetch(`${API_ENDPOINTS.TESTS_ASSESS}/${testCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          test_code: testCode,
          responses: apiResponses
        }),
      })

      if (response.ok) {
        const results = await response.json()
        onComplete(results)
      } else {
        const errorData = await response.json()
        console.error('Test submission failed:', errorData)
        throw new Error('Failed to submit test')
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      setError('Failed to submit test. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'depression':
        return 'from-red-500 to-red-600'
      case 'anxiety':
        return 'from-yellow-500 to-yellow-600'
      case 'stress':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-blue-500 to-blue-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'depression':
        return '❤️'
      case 'anxiety':
        return '🧠'
      case 'stress':
        return '⚡'
      default:
        return '📊'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-48 h-48 md:top-20 md:left-20 md:w-72 md:h-72 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 md:bottom-20 md:right-20 md:w-96 md:h-96 bg-gradient-to-br from-secondary-start/20 to-secondary-end/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-80 md:h-80 bg-gradient-to-br from-accent-start/15 to-accent-end/15 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 via-transparent to-accent-start/5 animate-water-flow"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading test...</div>
        </div>
      </div>
    )
  }

  if (error || !testDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <div className="text-white text-xl mb-4">{error || 'Test not found'}</div>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const currentQuestionData = testDetails.questions[currentQuestion]
  const currentResponse = responses[currentQuestionData?.id]
  const progress = ((currentQuestion + 1) / testDetails.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 md:top-20 md:left-20 md:w-72 md:h-72 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 md:bottom-20 md:right-20 md:w-96 md:h-96 bg-gradient-to-br from-secondary-start/20 to-secondary-end/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-80 md:h-80 bg-gradient-to-br from-accent-start/15 to-accent-end/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 via-transparent to-accent-start/5 animate-water-flow"></div>
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-white/70 hover:text-white transition-colors duration-300 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">{getCategoryIcon(testDetails.test_definition.test_category)}</span>
              <h1 className="text-3xl font-bold text-white">{testDetails.test_definition.test_name}</h1>
            </div>
            <p className="text-white/70">{testDetails.test_definition.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-white/70 text-sm mb-2">
              <span>Question {currentQuestion + 1} of {testDetails.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${getCategoryColor(testDetails.test_definition.test_category)} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            {currentQuestionData?.question_text}
          </h2>

          {/* Response Options */}
          <div className="space-y-4">
            {currentQuestionData?.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-300 ${
                  currentResponse === option.id
                    ? `bg-gradient-to-r ${getCategoryColor(testDetails.test_definition.test_category)} border-transparent text-white`
                    : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.option_text}</span>
                  {currentResponse === option.id && (
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentResponse === undefined}
            className={`flex items-center px-6 py-3 bg-gradient-to-r ${getCategoryColor(testDetails.test_definition.test_category)} text-white rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {currentQuestion === testDetails.questions.length - 1 ? (
              <>
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                {!isSubmitting && <ChevronRight className="w-5 h-5 ml-2" />}
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center text-yellow-400 mb-2">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Important Notice</span>
          </div>
          <p className="text-white/50 text-sm">
            This assessment is for informational purposes only and should not replace professional medical advice. 
            If you're experiencing severe symptoms, please consult with a mental health professional.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DynamicTestRunner
