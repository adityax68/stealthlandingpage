import React, { useState, useEffect } from 'react'
import { 
  Brain, 
  History, 
  LogOut, 
  User, 
  TrendingUp
} from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

import ComprehensiveAssessment from './assessment/ComprehensiveAssessment'
import ComprehensiveResults from './assessment/ComprehensiveResults'

interface DashboardProps {
  onLogout: () => void
  user: any
}

type Tab = 'assessment' | 'history'
type AssessmentView = 'main' | 'assessment' | 'results'

const Dashboard: React.FC<DashboardProps> = ({ onLogout, user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('assessment')
  const [assessmentView, setAssessmentView] = useState<AssessmentView>('main')
  const [assessmentResults, setAssessmentResults] = useState<any>(null)
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([])


  useEffect(() => {
    // Load assessment history
    loadAssessmentHistory()
  }, [])

  const loadAssessmentHistory = async () => {
    try {
      console.log('Loading assessment history...')
      const response = await fetch(API_ENDPOINTS.CLINICAL_ASSESSMENTS, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      console.log('History response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Assessment history data:', data)
        setAssessmentHistory(data)
      } else {
        console.error('Failed to load assessment history:', response.status)
      }
    } catch (error) {
      console.error('Error loading assessment history:', error)
    }
  }

  const handleStartAssessment = () => {
    setAssessmentView('assessment')
  }

  const handleAssessmentComplete = (results: any) => {
    setAssessmentResults(results)
    setAssessmentView('results')
    loadAssessmentHistory() // Refresh history
  }

  const handleBackToMain = () => {
    setAssessmentView('main')
  }

  const handleNewAssessment = () => {
    setAssessmentView('assessment')
  }

  const renderAssessmentContent = () => {
    if (assessmentView === 'assessment') {
      return (
        <ComprehensiveAssessment
          onComplete={handleAssessmentComplete}
          onBack={handleBackToMain}
        />
      )
    }

    if (assessmentView === 'results') {
      return (
        <ComprehensiveResults
          results={assessmentResults}
          onBack={handleBackToMain}
          onNewAssessment={handleNewAssessment}
        />
      )
    }

    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="gradient-text">Mental Health Assessment</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto px-4">
            Take a comprehensive mental health assessment to understand your current state and get personalized recommendations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-primary-start/10 to-primary-end/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-primary-start/30 transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary-start to-primary-end rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Comprehensive Assessment</h3>
              <p className="text-white/70 mb-6 sm:mb-8 text-base sm:text-lg">
                Complete evaluation covering depression, anxiety, and stress using validated clinical scales (PHQ-9, GAD-7, PSS-10).
              </p>
              <button
                onClick={handleStartAssessment}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-xl hover:from-primary-end hover:to-primary-start transition-all duration-300 transform hover:scale-105 font-semibold text-base sm:text-lg"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderHistoryContent = () => {
    return (
      <div className="p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Assessment History</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Review your past assessments and track your mental health progress over time.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {assessmentHistory.length > 0 ? (
            <div className="space-y-6">
              {assessmentHistory.map((assessment) => (
                <div key={assessment.id} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-start to-primary-end rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {assessment.assessment_name} Assessment
                        </h3>
                        <p className="text-white/70">
                          {new Date(assessment.created_at).toLocaleDateString()} at {new Date(assessment.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold gradient-text">
                        {assessment.total_score}/{assessment.max_score}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        assessment.severity_level === 'severe' || assessment.severity_level === 'high' 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : assessment.severity_level === 'moderate' || assessment.severity_level === 'moderately_severe'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-green-500/20 text-green-300 border border-green-500/30'
                      }`}>
                        {assessment.severity_level.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white/5 rounded-xl">
                    <p className="text-white/80">{assessment.interpretation}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-start/20 to-primary-end/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <History className="w-12 h-12 text-white/50" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">No Assessments Yet</h3>
              <p className="text-white/70 mb-8">
                Start your first assessment to begin tracking your mental health journey.
              </p>
              <button
                onClick={() => setActiveTab('assessment')}
                className="px-6 py-3 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-xl hover:from-primary-end hover:to-primary-start transition-all duration-300 font-semibold"
              >
                Start Your First Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'assessment':
        return renderAssessmentContent()
      case 'history':
        return renderHistoryContent()
      default:
        return renderAssessmentContent()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex">
      {/* Sidebar - Responsive width */}
      <div className="w-64 sm:w-72 lg:w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-start to-primary-end rounded-xl flex items-center justify-center">
              <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">Mental Health</span>
          </div>
          <div className="flex items-center space-x-2 text-white/70">
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-sm sm:text-base truncate">{user?.full_name || 'User'}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 p-3 sm:p-4 space-y-2">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'assessment'
                ? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Start Assessment</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Assessment History</span>
          </button>
        </div>

        {/* Logout Button */}
        <div className="p-3 sm:p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-300"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderMainContent()}
      </div>
    </div>
  )
}

export default Dashboard 