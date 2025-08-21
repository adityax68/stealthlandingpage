import React, { useState, useEffect } from 'react'
import { 
  Brain, 
  History, 
  LogOut, 
  User, 
  Shield,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Calendar,
  BarChart3
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())


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

  const toggleRowExpansion = (assessmentId: number) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(assessmentId)) {
      newExpandedRows.delete(assessmentId)
    } else {
      newExpandedRows.add(assessmentId)
    }
    setExpandedRows(newExpandedRows)
  }

  const getSeverityColor = (severity: string) => {
    const level = severity.toLowerCase()
    if (level === 'severe' || level === 'high') {
      return 'bg-red-500/20 text-red-300 border-red-500/30'
    } else if (level === 'moderate' || level === 'moderately_severe') {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    } else {
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    }
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
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">
            <span className="gradient-text">Assessment History</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto px-4">
            Review your past assessments and track your mental health progress over time.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {assessmentHistory.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {/* Table Header */}
                <div className="bg-white/5 border-b border-white/10 px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-white/80">
                    <div className="col-span-1"></div>
                    <div className="col-span-3 text-left">Assessment</div>
                    <div className="col-span-2 text-left">Date & Time</div>
                    <div className="col-span-2 text-center">Total Score</div>
                    <div className="col-span-2 text-center">Severity</div>
                    <div className="col-span-2 text-center">Actions</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/10">
                  {assessmentHistory.map((assessment) => (
                    <div key={assessment.id} className="group hover:bg-white/5 transition-all duration-300">
                      {/* Main Row */}
                      <div className="px-6 py-4">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Expand/Collapse Icon */}
                          <div className="col-span-1">
                            <button
                              onClick={() => toggleRowExpansion(assessment.id)}
                              className="p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
                            >
                              {expandedRows.has(assessment.id) ? (
                                <ChevronDown className="w-4 h-4 text-white/60" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-white/60" />
                              )}
                            </button>
                          </div>

                          {/* Assessment Name */}
                          <div className="col-span-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center flex-shrink-0">
                                <BarChart3 className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-sm lg:text-base">
                                  {assessment.assessment_name} Assessment
                                </h3>
                                <p className="text-white/60 text-xs lg:text-sm">ID: {assessment.id}</p>
                              </div>
                            </div>
                          </div>

                          {/* Date & Time */}
                          <div className="col-span-2">
                            <div className="flex items-center space-x-2 text-white/80">
                              <Calendar className="w-4 h-4" />
                              <div className="text-sm">
                                <div>{new Date(assessment.created_at).toLocaleDateString()}</div>
                                <div className="text-white/60 text-xs">
                                  {new Date(assessment.created_at).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Total Score */}
                          <div className="col-span-2">
                            <div className="text-center">
                              <div className="text-xl font-bold gradient-text">
                                {assessment.total_score}/{assessment.max_score}
                              </div>
                              <div className="text-xs text-white/60">Total Score</div>
                            </div>
                          </div>

                          {/* Severity */}
                          <div className="col-span-2">
                            <div className="flex justify-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(assessment.severity_level)}`}>
                                {assessment.severity_level.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-2">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => toggleRowExpansion(assessment.id)}
                                className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:bg-white/20 transition-all duration-200 text-xs"
                              >
                                {expandedRows.has(assessment.id) ? 'Hide' : 'View'} Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedRows.has(assessment.id) && (
                        <div className="bg-white/5 border-t border-white/10 px-6 py-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Assessment Details */}
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-white mb-3">Assessment Details</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                  <span className="text-white/70">Assessment Type:</span>
                                  <span className="text-white font-medium">{assessment.assessment_name}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                  <span className="text-white/70">Completion Date:</span>
                                  <span className="text-white font-medium">
                                    {new Date(assessment.created_at).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                  <span className="text-white/70">Completion Time:</span>
                                  <span className="text-white font-medium">
                                    {new Date(assessment.created_at).toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Score Breakdown */}
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-white mb-3">Score Breakdown</h4>
                              <div className="space-y-3">
                                <div className="p-3 bg-white/5 rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-white/70">Total Score:</span>
                                    <span className="text-xl font-bold gradient-text">
                                      {assessment.total_score}/{assessment.max_score}
                                    </span>
                                  </div>
                                  <div className="w-full bg-white/10 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-primary-start to-primary-end h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${(assessment.total_score / assessment.max_score) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                <div className="p-3 bg-white/5 rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-white/70">Overall Severity:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(assessment.severity_level)}`}>
                                      {assessment.severity_level.replace('_', ' ').toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Interpretation */}
                          <div className="mt-6 p-4 bg-gradient-to-r from-primary-start/10 to-primary-end/10 rounded-lg border border-primary-start/20">
                            <h4 className="text-lg font-semibold text-white mb-3">Interpretation</h4>
                            <p className="text-white/80 leading-relaxed">{assessment.interpretation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {assessmentHistory.map((assessment) => (
                  <div key={assessment.id} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                    {/* Main Card Content */}
                    <div className="p-4">
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">
                              {assessment.assessment_name} Assessment
                            </h3>
                            <p className="text-white/60 text-xs">ID: {assessment.id}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleRowExpansion(assessment.id)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                        >
                          {expandedRows.has(assessment.id) ? (
                            <ChevronDown className="w-4 h-4 text-white/60" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-white/60" />
                          )}
                        </button>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {/* Date & Time */}
                        <div className="flex items-center space-x-2 text-white/80">
                          <Calendar className="w-4 h-4" />
                          <div className="text-xs">
                            <div>{new Date(assessment.created_at).toLocaleDateString()}</div>
                            <div className="text-white/60">
                              {new Date(assessment.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>

                        {/* Total Score */}
                        <div className="text-center">
                          <div className="text-lg font-bold gradient-text">
                            {assessment.total_score}/{assessment.max_score}
                          </div>
                          <div className="text-xs text-white/60">Total Score</div>
                        </div>
                      </div>

                      {/* Severity and Action */}
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(assessment.severity_level)}`}>
                          {assessment.severity_level.replace('_', ' ').toUpperCase()}
                        </span>
                        <button
                          onClick={() => toggleRowExpansion(assessment.id)}
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:bg-white/20 transition-all duration-200 text-xs"
                        >
                          {expandedRows.has(assessment.id) ? 'Hide' : 'View'} Details
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details - Mobile */}
                    {expandedRows.has(assessment.id) && (
                      <div className="bg-white/5 border-t border-white/10 p-4">
                        <div className="space-y-4">
                          {/* Assessment Details */}
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">Assessment Details</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg text-sm">
                                <span className="text-white/70">Type:</span>
                                <span className="text-white font-medium">{assessment.assessment_name}</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg text-sm">
                                <span className="text-white/70">Date:</span>
                                <span className="text-white font-medium">
                                  {new Date(assessment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg text-sm">
                                <span className="text-white/70">Time:</span>
                                <span className="text-white font-medium">
                                  {new Date(assessment.created_at).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Score Breakdown */}
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">Score Breakdown</h4>
                            <div className="p-3 bg-white/5 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white/70 text-sm">Total Score:</span>
                                <span className="text-lg font-bold gradient-text">
                                  {assessment.total_score}/{assessment.max_score}
                                </span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-gradient-to-r from-primary-start to-primary-end h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(assessment.total_score / assessment.max_score) * 100}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/70 text-sm">Severity:</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(assessment.severity_level)}`}>
                                  {assessment.severity_level.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Interpretation */}
                          <div className="p-3 bg-gradient-to-r from-primary-start/10 to-primary-end/10 rounded-lg border border-primary-start/20">
                            <h4 className="text-base font-semibold text-white mb-2">Interpretation</h4>
                            <p className="text-white/80 text-sm leading-relaxed">{assessment.interpretation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-primary-start/20 to-primary-end/20 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <History className="w-10 h-10 sm:w-12 sm:h-12 text-white/50" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">No Assessments Yet</h3>
              <p className="text-white/70 mb-6 sm:mb-8 text-sm sm:text-base px-4">
                Start your first assessment to begin tracking your mental health journey.
              </p>
              <button
                onClick={() => setActiveTab('assessment')}
                className="px-6 py-3 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-xl hover:from-primary-end hover:to-primary-start transition-all duration-300 font-semibold text-sm sm:text-base"
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
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex overflow-hidden">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Full height and mobile responsive */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40
        w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 
        flex flex-col h-screen overflow-hidden
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Background overlay to ensure consistent color */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl pointer-events-none"></div>
        
        {/* Header - Fixed at top */}
        <div className="p-4 border-b border-white/10 relative z-10 mt-16 md:mt-0 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Mind Acuity</span>
          </div>
          <div className="flex items-center space-x-2 text-white/70">
            <User className="w-4 h-4" />
            <span className="text-sm truncate">{user?.full_name || 'User'}</span>
          </div>
        </div>

        {/* Navigation Tabs - Scrollable middle section */}
        <div className="flex-1 p-3 space-y-2 relative z-10 overflow-y-auto">
          <button
            onClick={() => {
              setActiveTab('assessment')
              setIsSidebarOpen(false) // Close sidebar on mobile after selection
            }}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'assessment'
                ? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span className="font-medium text-sm">Start Assessment</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('history')
              setIsSidebarOpen(false) // Close sidebar on mobile after selection
            }}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="font-medium text-sm">Assessment History</span>
          </button>

          {/* Admin Navigation - Only show if user is admin */}
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                window.location.href = '/admin'
                setIsSidebarOpen(false) // Close sidebar on mobile after selection
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5"
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium text-sm">Admin Panel</span>
            </button>
          )}
        </div>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-3 border-t border-white/10 relative z-10 flex-shrink-0">
          <button
            onClick={() => {
              onLogout()
              setIsSidebarOpen(false) // Close sidebar on mobile after logout
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-screen">
        {renderMainContent()}
      </div>
    </div>
  )
}

export default Dashboard 