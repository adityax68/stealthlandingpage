import React from 'react'
import { CheckCircle, AlertTriangle, TrendingUp, Brain, Activity, Heart, Zap, ArrowLeft, RefreshCw } from 'lucide-react'

interface ComprehensiveResultsProps {
  results: {
    assessment_type: string
    assessment_name: string
    total_score: number
    max_score: number
    depression: {
      score: number
      max_score: number
      severity: string
      interpretation: string
    }
    anxiety: {
      score: number
      max_score: number
      severity: string
      interpretation: string
    }
    stress: {
      score: number
      max_score: number
      severity: string
      interpretation: string
    }
    responses: any[]
    created_at: string
  }
  onBack: () => void
  onNewAssessment: () => void
}

const ComprehensiveResults: React.FC<ComprehensiveResultsProps> = ({ results, onBack, onNewAssessment }) => {
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

  const getOverallRiskLevel = () => {
    const severities = [
      results.depression.severity,
      results.anxiety.severity,
      results.stress.severity
    ]
    
    const highRiskCount = severities.filter(s => 
      ['severe', 'moderately_severe', 'high'].includes(s.toLowerCase())
    ).length
    
    const moderateRiskCount = severities.filter(s => 
      ['moderate'].includes(s.toLowerCase())
    ).length

    if (highRiskCount > 0) return 'high'
    if (moderateRiskCount > 0) return 'medium'
    return 'low'
  }

  const getOverallRecommendations = () => {
    const recommendations = []
    const overallRisk = getOverallRiskLevel()

    // Category-specific recommendations
    if (results.depression.severity !== 'minimal') {
      recommendations.push(`Depression: ${results.depression.interpretation}`)
    }
    if (results.anxiety.severity !== 'minimal') {
      recommendations.push(`Anxiety: ${results.anxiety.interpretation}`)
    }
    if (results.stress.severity !== 'low') {
      recommendations.push(`Stress: ${results.stress.interpretation}`)
    }

    // Overall recommendations
    if (overallRisk === 'high') {
      recommendations.push("Professional consultation is strongly recommended")
      recommendations.push("Consider comprehensive treatment plan including medication and therapy")
    } else if (overallRisk === 'medium') {
      recommendations.push("Consider professional consultation for specific concerns")
      recommendations.push("Implement evidence-based self-help strategies")
    } else {
      recommendations.push("Continue monitoring your mental health regularly")
      recommendations.push("Maintain healthy lifestyle habits")
    }

    return recommendations
  }

  const overallRisk = getOverallRiskLevel()
  const recommendations = getOverallRecommendations()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 md:top-20 md:left-20 md:w-72 md:h-72 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 md:bottom-20 md:right-20 md:w-96 md:h-96 bg-gradient-to-br from-secondary-start/20 to-secondary-end/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-80 md:h-80 bg-gradient-to-br from-accent-start/15 to-accent-end/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 via-transparent to-accent-start/5 animate-water-flow"></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
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
            <h1 className="text-3xl font-bold text-white mb-2">Comprehensive Assessment Results</h1>
            <p className="text-white/70">Complete analysis of depression, anxiety, and stress levels</p>
          </div>
        </div>

        {/* Overall Risk Level */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Overall Mental Health Status</h2>
            <div className="flex items-center justify-center space-x-3 mb-4">
              {getSeverityIcon(overallRisk)}
              <span className={`text-2xl font-bold ${getSeverityColor(overallRisk)}`}>
                {overallRisk.toUpperCase()} RISK
              </span>
            </div>
            <p className="text-white/80">
              Based on your responses across all three assessment categories
            </p>
          </div>
        </div>

        {/* Category Results */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Depression */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-4">
              <Heart className="w-6 h-6 text-red-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Depression (PHQ-9)</h3>
            </div>
            <div className="text-center mb-4">
              <div className={`text-3xl font-bold mb-2 ${getSeverityColor(results.depression.severity)}`}>
                {results.depression.score}/{results.depression.max_score}
              </div>
              <div className={`text-lg font-medium ${getSeverityColor(results.depression.severity)}`}>
                {results.depression.severity.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getSeverityColor(results.depression.severity).replace('text-', 'bg-')}`}
                style={{ width: `${(results.depression.score / results.depression.max_score) * 100}%` }}
              ></div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {results.depression.interpretation}
            </p>
          </div>

          {/* Anxiety */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-yellow-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Anxiety (GAD-7)</h3>
            </div>
            <div className="text-center mb-4">
              <div className={`text-3xl font-bold mb-2 ${getSeverityColor(results.anxiety.severity)}`}>
                {results.anxiety.score}/{results.anxiety.max_score}
              </div>
              <div className={`text-lg font-medium ${getSeverityColor(results.anxiety.severity)}`}>
                {results.anxiety.severity.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getSeverityColor(results.anxiety.severity).replace('text-', 'bg-')}`}
                style={{ width: `${(results.anxiety.score / results.anxiety.max_score) * 100}%` }}
              ></div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {results.anxiety.interpretation}
            </p>
          </div>

          {/* Stress */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Stress (PSS-10)</h3>
            </div>
            <div className="text-center mb-4">
              <div className={`text-3xl font-bold mb-2 ${getSeverityColor(results.stress.severity)}`}>
                {results.stress.score}/{results.stress.max_score}
              </div>
              <div className={`text-lg font-medium ${getSeverityColor(results.stress.severity)}`}>
                {results.stress.severity.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getSeverityColor(results.stress.severity).replace('text-', 'bg-')}`}
                style={{ width: `${(results.stress.score / results.stress.max_score) * 100}%` }}
              ></div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {results.stress.interpretation}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3" />
            Recommendations & Next Steps
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
              <span className="text-white ml-2">{results.assessment_name}</span>
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
            <div>
              <span className="text-white/70">Total Score:</span>
              <span className="text-white ml-2">{results.total_score}/{results.max_score}</span>
            </div>
            <div>
              <span className="text-white/70">Overall Risk Level:</span>
              <span className={`ml-2 font-medium ${getSeverityColor(overallRisk)}`}>
                {overallRisk.toUpperCase()}
              </span>
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

export default ComprehensiveResults 