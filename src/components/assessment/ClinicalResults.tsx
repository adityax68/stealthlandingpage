import React from 'react'
import { CheckCircle, AlertTriangle, TrendingUp, Brain, Activity, Heart, Zap, ArrowLeft, RefreshCw } from 'lucide-react'

interface ClinicalResultsProps {
  results: {
    assessment_type: string
    assessment_name: string
    total_score: number
    max_score: number
    severity_level: string
    interpretation: string
    responses: any[]
    created_at: string
  }
  onBack: () => void
  onNewAssessment: () => void
}

const ClinicalResults: React.FC<ClinicalResultsProps> = ({ results, onBack, onNewAssessment }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minimal':
      case 'low':
        return 'text-green-400'
      case 'mild':
        return 'text-yellow-400'
      case 'moderate':
        return 'text-orange-400'
      case 'moderately_severe':
      case 'severe':
      case 'high':
        return 'text-red-400'
      default:
        return 'text-white'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minimal':
      case 'low':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'mild':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />
      case 'moderate':
        return <AlertTriangle className="w-6 h-6 text-orange-400" />
      case 'moderately_severe':
      case 'severe':
      case 'high':
        return <AlertTriangle className="w-6 h-6 text-red-400" />
      default:
        return <Brain className="w-6 h-6 text-white" />
    }
  }

  const getAssessmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'phq-9':
        return <Heart className="w-8 h-8 text-red-400" />
      case 'gad-7':
        return <Zap className="w-8 h-8 text-yellow-400" />
      case 'pss-10':
        return <Activity className="w-8 h-8 text-blue-400" />
      default:
        return <Brain className="w-8 h-8 text-purple-400" />
    }
  }

  const getScorePercentage = () => {
    return Math.round((results.total_score / results.max_score) * 100)
  }

  const getRecommendations = (severity: string, type: string) => {
    const recommendations = []
    
    switch (severity.toLowerCase()) {
      case 'minimal':
      case 'low':
        recommendations.push("Continue monitoring your mental health regularly")
        recommendations.push("Maintain healthy lifestyle habits")
        break
      case 'mild':
        recommendations.push("Consider implementing stress management techniques")
        recommendations.push("Monitor symptoms and consider follow-up assessment")
        break
      case 'moderate':
        recommendations.push("Consider seeking professional consultation")
        recommendations.push("Implement evidence-based self-help strategies")
        break
      case 'moderately_severe':
      case 'severe':
      case 'high':
        recommendations.push("Professional consultation is strongly recommended")
        recommendations.push("Consider medication and therapy options")
        recommendations.push("Develop a comprehensive treatment plan")
        break
    }

    // Add type-specific recommendations
    if (type.toLowerCase().includes('phq')) {
      recommendations.push("Focus on mood regulation and positive activities")
    } else if (type.toLowerCase().includes('gad')) {
      recommendations.push("Practice relaxation techniques and mindfulness")
    } else if (type.toLowerCase().includes('pss')) {
      recommendations.push("Develop stress management and coping strategies")
    }

    return recommendations
  }

  const severityIcon = getSeverityIcon(results.severity_level)
  const severityColor = getSeverityColor(results.severity_level)
  const assessmentIcon = getAssessmentIcon(results.assessment_type)
  const scorePercentage = getScorePercentage()
  const recommendations = getRecommendations(results.severity_level, results.assessment_type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-white/70 hover:text-white transition-colors duration-300 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              {assessmentIcon}
              <h1 className="text-3xl font-bold text-white ml-3">{results.assessment_name}</h1>
            </div>
            <div className="flex items-center justify-center space-x-3">
              {severityIcon}
              <span className={`text-xl font-semibold ${severityColor}`}>
                {results.severity_level.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Score Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3" />
              Assessment Score
            </h2>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${severityColor}`}>
                {results.total_score}/{results.max_score}
              </div>
              <div className="text-lg font-medium text-white/70 mb-4">
                {scorePercentage}% of maximum score
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${severityColor.replace('text-', 'bg-')}`}
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Severity Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-3" />
              Severity Level
            </h2>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-3 ${severityColor}`}>
                {results.severity_level.replace('_', ' ').toUpperCase()}
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                {results.interpretation}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3" />
            Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-primary-start rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/90">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Details */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Assessment Details</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/70">Assessment Type:</span>
              <span className="text-white ml-2">{results.assessment_type}</span>
            </div>
            <div>
              <span className="text-white/70">Date:</span>
              <span className="text-white ml-2">
                {new Date(results.created_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-white/70">Time:</span>
              <span className="text-white ml-2">
                {new Date(results.created_at).toLocaleTimeString()}
              </span>
            </div>
            <div>
              <span className="text-white/70">Questions Answered:</span>
              <span className="text-white ml-2">{results.responses.length}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNewAssessment}
            className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Take Another Assessment
          </button>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
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
            This assessment is for informational purposes only and should not replace professional medical advice. 
            If you're experiencing severe symptoms, please consult with a mental health professional.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClinicalResults 