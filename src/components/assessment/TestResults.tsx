import React from 'react'
import { ChevronLeft, CheckCircle, AlertTriangle, TrendingUp, Clock, Target } from 'lucide-react'

interface TestResultsProps {
  results: {
    id: number
    user_id: number
    test_definition_id: number
    test_code: string
    test_name: string
    test_category: string
    calculated_score: number
    max_score: number
    severity_level: string
    severity_label: string
    interpretation: string
    recommendations?: string
    color_code?: string
    raw_responses: any[]
    created_at: string
  }
  onBack: () => void
  onTakeAnother: () => void
}

const TestResults: React.FC<TestResultsProps> = ({ 
  results, 
  onBack, 
  onTakeAnother 
}) => {
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

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minimal':
      case 'low':
        return 'text-green-400 bg-green-500/20'
      case 'mild':
        return 'text-yellow-400 bg-yellow-500/20'
      case 'moderate':
        return 'text-orange-400 bg-orange-500/20'
      case 'moderately_severe':
      case 'severe':
      case 'high':
        return 'text-red-400 bg-red-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getScorePercentage = () => {
    return Math.round((results.calculated_score / results.max_score) * 100)
  }

  const getScoreDescription = (percentage: number) => {
    if (percentage <= 20) return 'Very Low'
    if (percentage <= 40) return 'Low'
    if (percentage <= 60) return 'Moderate'
    if (percentage <= 80) return 'High'
    return 'Very High'
  }

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
              <span className="text-4xl mr-3">{getCategoryIcon(results.test_category)}</span>
              <h1 className="text-3xl font-bold text-white">{results.test_name} Results</h1>
            </div>
            <p className="text-white/70">Assessment completed successfully</p>
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Your Score</h3>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-2">
                {results.calculated_score}/{results.max_score}
              </div>
              <div className="text-white/70">
                {getScoreDescription(getScorePercentage())} ({getScorePercentage()}%)
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-3 mb-4">
              <div 
                className={`bg-gradient-to-r ${getCategoryColor(results.test_category)} h-3 rounded-full transition-all duration-1000`}
                style={{ width: `${getScorePercentage()}%` }}
              ></div>
            </div>

            <div className="text-center text-white/60 text-sm">
              Completed on {new Date(results.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Severity Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Severity Level</h3>
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            
            <div className="text-center mb-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getSeverityColor(results.severity_level)}`}>
                {results.severity_label}
              </div>
            </div>

            <div className="text-white/80 text-sm leading-relaxed">
              {results.interpretation}
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Assessment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Test Type</h4>
              <p className="text-white/70 text-sm">{results.test_name}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Completion Time</h4>
              <p className="text-white/70 text-sm">5-10 minutes</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Category</h4>
              <p className="text-white/70 text-sm capitalize">{results.test_category}</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {results.recommendations && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Recommendations</h3>
            <div className="text-white/80 leading-relaxed">
              {results.recommendations}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onTakeAnother}
            className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
          >
            Take Another Test
          </button>
          
          <button
            onClick={onBack}
            className="flex items-center justify-center px-8 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center text-yellow-400 mb-2">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Important Notice</span>
          </div>
          <p className="text-white/50 text-sm">
            These results are for informational purposes only and should not replace professional medical advice. 
            If you're experiencing severe symptoms, please consult with a mental health professional.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TestResults
