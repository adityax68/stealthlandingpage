import React, { useState, useEffect } from 'react'
import { Brain, Heart, Zap, ChevronRight, Clock, Users, BarChart3 } from 'lucide-react'
import { API_ENDPOINTS } from '../../config/api'

interface TestDefinition {
  id: number
  test_code: string
  test_name: string
  test_category: string
  description: string
  total_questions: number
  is_active: boolean
  created_at: string
}

interface TestSelectorProps {
  onTestSelect: (testCode: string) => void
  onBack: () => void
}

const TestSelector: React.FC<TestSelectorProps> = ({ onTestSelect, onBack }) => {
  const [tests, setTests] = useState<TestDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTests()
  }, [])

  const loadTests = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.TESTS_DEFINITIONS}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTests(data)
      } else {
        throw new Error('Failed to load tests')
      }
    } catch (error) {
      console.error('Error loading tests:', error)
      setError('Failed to load tests. Please try again.')
      // Fallback to hardcoded tests
      setTests(getFallbackTests())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackTests = (): TestDefinition[] => [
    {
      id: 1,
      test_code: 'phq9',
      test_name: 'PHQ-9',
      test_category: 'depression',
      description: 'Patient Health Questionnaire-9: A validated tool for assessing depression severity',
      total_questions: 9,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      test_code: 'gad7',
      test_name: 'GAD-7',
      test_category: 'anxiety',
      description: 'Generalized Anxiety Disorder-7: A validated tool for assessing anxiety severity',
      total_questions: 7,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      test_code: 'pss10',
      test_name: 'PSS-10',
      test_category: 'stress',
      description: 'Perceived Stress Scale-10: A validated tool for assessing stress levels',
      total_questions: 10,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]

  const getTestIcon = (category: string) => {
    switch (category) {
      case 'depression':
        return <Heart className="w-8 h-8 text-red-400" />
      case 'anxiety':
        return <Brain className="w-8 h-8 text-yellow-400" />
      case 'stress':
        return <Zap className="w-8 h-8 text-orange-400" />
      default:
        return <BarChart3 className="w-8 h-8 text-blue-400" />
    }
  }

  const getTestColor = (category: string) => {
    switch (category) {
      case 'depression':
        return 'from-red-500/20 to-red-600/20 border-red-500/30 hover:from-red-500/30 hover:to-red-600/30'
      case 'anxiety':
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 hover:from-yellow-500/30 hover:to-yellow-600/30'
      case 'stress':
        return 'from-orange-500/20 to-orange-600/20 border-orange-500/30 hover:from-orange-500/30 hover:to-orange-600/30'
      default:
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/30'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'depression':
        return 'Depression Assessment'
      case 'anxiety':
        return 'Anxiety Assessment'
      case 'stress':
        return 'Stress Assessment'
      default:
        return 'Mental Health Assessment'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading tests...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <div className="text-white text-xl mb-4">{error}</div>
          <button
            onClick={loadTests}
            className="px-6 py-3 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-white/70 hover:text-white transition-colors duration-300 mb-4"
          >
            <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
            Back to Dashboard
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Mental Health Assessments</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Choose from our validated clinical assessments to get insights into your mental health and well-being.
            </p>
          </div>
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tests.map((test) => (
            <div
              key={test.id}
              onClick={() => onTestSelect(test.test_code)}
              className={`bg-gradient-to-br ${getTestColor(test.test_category)} backdrop-blur-xl rounded-2xl p-6 border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors duration-300">
                  {getTestIcon(test.test_category)}
                </div>
                <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">{test.test_name}</h3>
                <p className="text-white/80 text-sm font-medium mb-1">{getCategoryLabel(test.test_category)}</p>
                <p className="text-white/60 text-sm leading-relaxed">{test.description}</p>
              </div>

              <div className="flex items-center justify-between text-white/60 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{test.total_questions} questions</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>5-10 min</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Information Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">About These Assessments</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Clinically Validated</h4>
              <p className="text-white/70 text-sm">All assessments are based on established clinical scales used by mental health professionals.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Quick & Easy</h4>
              <p className="text-white/70 text-sm">Complete assessments in just 5-10 minutes with simple, clear questions.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Personalized Results</h4>
              <p className="text-white/70 text-sm">Get detailed insights and recommendations based on your responses.</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            These assessments are for informational purposes only and should not replace professional medical advice. 
            If you're experiencing severe symptoms, please consult with a mental health professional.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TestSelector
