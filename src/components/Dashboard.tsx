import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  BarChart3,
  Users,
  Settings,
  Building,
  UserCheck,
  AlertCircle
} from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

import ComprehensiveAssessment from './assessment/ComprehensiveAssessment'
import ComprehensiveResults from './assessment/ComprehensiveResults'
import HRDashboard from './hr/HRDashboard'
import EmployeeSupport from './EmployeeSupport'
import EmployeeRequestModal from './EmployeeRequestModal'
import { useEmployeeModal } from '../contexts/EmployeeModalContext'
import { useToast } from '../contexts/ToastContext'

interface DashboardProps {
  onLogout: () => void
  user: any
}

type Tab = 'assessment' | 'history' | 'hr' | 'settings' | 'support'
type AssessmentView = 'main' | 'assessment' | 'results'

const Dashboard: React.FC<DashboardProps> = ({ onLogout, user }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('assessment')
  const [assessmentView, setAssessmentView] = useState<AssessmentView>('main')
  const [assessmentResults, setAssessmentResults] = useState<any>(null)
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  
  // Settings menu state
  const [isRequestingAccess, setIsRequestingAccess] = useState(false)
  
  // Employee modal context
  const { openEmployeeModal, isEmployeeModalOpen } = useEmployeeModal()
  
  // Toast context
  const { showToast } = useToast()
  
  console.log('Dashboard rendered, openEmployeeModal function:', openEmployeeModal)
  console.log('Dashboard rendered, isEmployeeModalOpen state:', isEmployeeModalOpen)
  console.log('Current user:', user)

  // Close settings menu when clicking outside
  useEffect(() => {
    // No longer needed since we removed the dropdown menu
  }, [])

  // Debug useEffect for settings state
  useEffect(() => {
    // No longer needed since we removed the dropdown menu
  }, [])

  const handleRequestAccess = async (accessType: string) => {
    console.log('🚀 handleRequestAccess called with:', accessType)
    console.log('🚀 openEmployeeModal function:', openEmployeeModal)
    
    if (accessType === 'employee') {
      console.log('🚀 Employee access requested, about to call openEmployeeModal()')
      openEmployeeModal()
      console.log('🚀 openEmployeeModal() called successfully')
      return
    }
    
    try {
      setIsRequestingAccess(true)
      
      const token = localStorage.getItem('token')
      if (!token) {
        showToast('No authentication token found', 'error')
        return
      }

      console.log('🚀 Making API request for', accessType, 'access...')
      const response = await fetch(`${API_ENDPOINTS.ACCESS_REQUEST}?access_type=${accessType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('🚀 API response:', response.status, data)

      if (response.ok) {
        // Success - show success toast
        const successMessage = data.message || `${accessType.toUpperCase()} access granted successfully!`
        showToast(successMessage, 'success')
        
        // Update user role in localStorage if available
        if (data.new_role) {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
          currentUser.role = data.new_role
          localStorage.setItem('user', JSON.stringify(currentUser))
          console.log('🚀 User role updated to:', data.new_role)
          
          // Force a re-render by updating the user object
          if (user) {
            user.role = data.new_role
          }
        }
      } else {
        // Error - show error message with specific handling for HR access
        let errorMessage = data.detail || 'Failed to request access'
        
        if (response.status === 403 && accessType === 'hr') {
          errorMessage = 'Your organisation is not registered with us. Please contact your HR department to register your organisation.'
        } else if (response.status === 400 && errorMessage.includes('already has elevated access')) {
          errorMessage = 'You already have elevated access. No additional access is needed.'
        } else if (response.status === 400 && errorMessage.includes('Admin users cannot request additional access')) {
          errorMessage = 'Admin users already have full access to the system.'
        }
        
        showToast(errorMessage, 'error')
        console.error(`Error: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error requesting access:', error)
      showToast('Failed to request access. Please try again.', 'error')
    } finally {
      setIsRequestingAccess(false)
    }
  }


  useEffect(() => {
    // Load assessment history only when component mounts
    loadAssessmentHistory()
  }, [])

  // Load assessment history when switching to history tab
  useEffect(() => {
    if (activeTab === 'history') {
      loadAssessmentHistory()
    }
  }, [activeTab])

  // Reset assessment view when activeTab changes
  useEffect(() => {
    if (activeTab !== 'assessment') {
      setAssessmentView('main')
      setExpandedRows(new Set())
    }
  }, [activeTab])

  const loadAssessmentHistory = async () => {
    try {
      setIsLoadingHistory(true)
      console.log('Loading assessment history...')
      const response = await fetch(API_ENDPOINTS.UNIFIED_ASSESSMENTS, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      console.log('History response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Assessment history data:', data)
        
        // Deduplicate assessments by ID to prevent duplicate keys
        const uniqueAssessments = data.filter((assessment: any, index: number, self: any[]) => 
          index === self.findIndex((a: any) => a.id === assessment.id)
        )
        console.log('Unique assessments after deduplication:', uniqueAssessments)
        setAssessmentHistory(uniqueAssessments)
      } else {
        console.error('Failed to load assessment history:', response.status)
      }
    } catch (error) {
      console.error('Error loading assessment history:', error)
    } finally {
      setIsLoadingHistory(false)
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
      <div className="p-4 sm:p-6 lg:p-8 min-h-full">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="gradient-text">Mental Health Assessment</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto px-4">
            Take a comprehensive mental health assessment to understand your current state and get personalized recommendations.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Individual Tests Section */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Individual Mental Health Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* PHQ-9 Depression Test */}
              <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105 cursor-pointer group" onClick={() => navigate('/tests?test=phq9')}>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">PHQ-9</h3>
                  <p className="text-white/70 mb-4 text-sm">Depression Assessment</p>
                  <p className="text-white/60 text-xs mb-4">9 questions • 5-10 minutes</p>
                  <div className="text-red-400 text-sm font-medium">Start Depression Test →</div>
                </div>
              </div>

              {/* GAD-7 Anxiety Test */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:scale-105 cursor-pointer group" onClick={() => navigate('/tests?test=gad7')}>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">GAD-7</h3>
                  <p className="text-white/70 mb-4 text-sm">Anxiety Assessment</p>
                  <p className="text-white/60 text-xs mb-4">7 questions • 5-10 minutes</p>
                  <div className="text-yellow-400 text-sm font-medium">Start Anxiety Test →</div>
                </div>
              </div>

              {/* PSS-10 Stress Test */}
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105 cursor-pointer group" onClick={() => navigate('/tests?test=pss10')}>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">PSS-10</h3>
                  <p className="text-white/70 mb-4 text-sm">Stress Assessment</p>
                  <p className="text-white/60 text-xs mb-4">10 questions • 5-10 minutes</p>
                  <div className="text-orange-400 text-sm font-medium">Start Stress Test →</div>
                </div>
              </div>
            </div>
          </div>

          {/* Comprehensive Assessment */}
          <div className="bg-gradient-to-br from-primary-start/10 to-primary-end/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-primary-start/30 transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary-start to-primary-end rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Comprehensive Assessment</h3>
              <p className="text-white/70 mb-6 sm:mb-8 text-base sm:text-lg">
                Complete evaluation covering depression, anxiety, and stress using validated clinical scales (PHQ-9, GAD-7, PSS-10).
              </p>
              <button
                onClick={handleStartAssessment}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-xl hover:from-primary-end hover:to-primary-start transition-all duration-300 transform hover:scale-105 font-semibold text-base sm:text-lg"
              >
                Start Comprehensive Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderLoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-start/30 border-t-primary-start rounded-full animate-spin"></div>
        <p className="text-white/70 text-lg">Loading...</p>
      </div>
    </div>
  )

  const renderHistoryContent = () => {
    console.log('Rendering history content, assessmentHistory length:', assessmentHistory.length)
    console.log('Assessment history data:', assessmentHistory)
    return (
      <div className="p-4 sm:p-6 lg:p-8 min-h-full">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center justify-center gap-4 mb-3 sm:mb-4 lg:mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
              <span className="gradient-text">Assessment History</span>
            </h1>
            <button
              onClick={loadAssessmentHistory}
              disabled={isLoadingHistory}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh assessment history"
            >
              <svg 
                className={`w-5 h-5 text-white ${isLoadingHistory ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto px-4">
            Review your past assessments and track your mental health progress over time.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {isLoadingHistory ? (
            renderLoadingSpinner()
          ) : assessmentHistory.length > 0 ? (
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
                  {assessmentHistory.map((assessment, index) => (
                    <div key={`desktop-assessment-${assessment.id}-${assessment.created_at}-${index}`} className="group hover:bg-white/5 transition-all duration-300">
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
                {assessmentHistory.map((assessment, index) => (
                  <div key={`mobile-assessment-${assessment.id}-${assessment.created_at}-${index}`} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
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
                onClick={() => handleTabSwitch('assessment')}
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

  const renderSettingsContent = () => {
    return (
      <div className="p-4 sm:p-6 lg:p-8 min-h-full">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto px-4">
            Manage your account settings and request additional access levels.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Current Role Display */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Current Access Level</h2>
            <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${
              user?.role === 'hr' ? 'border-blue-500/30 bg-blue-500/20 text-blue-300' :
              user?.role === 'employee' ? 'border-green-500/30 bg-green-500/20 text-green-300' :
              user?.role === 'counsellor' ? 'border-orange-500/30 bg-orange-500/20 text-orange-300' :
              user?.role === 'admin' ? 'border-purple-500/30 bg-purple-500/20 text-purple-300' :
              'border-gray-500/30 bg-gray-500/20 text-gray-300'
            }`}>
              <span className="font-medium">{user?.role?.toUpperCase() || 'USER'}</span>
            </div>
          </div>

          {/* Access Request Options - Only show for basic users */}
          {user?.role === 'user' && (
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Request Additional Access</h2>
              <p className="text-white/70 mb-6">Request elevated access levels for additional features and permissions.</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* Employee Access */}
                <button
                  onClick={() => {
                    console.log('Employee access requested from Settings page')
                    openEmployeeModal()
                  }}
                  className="p-6 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl hover:border-green-400/50 transition-all duration-300 group"
                >
                  <div className="text-center">
                    <Building className="w-12 h-12 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-lg font-semibold text-white mb-2">Employee Access</h3>
                    <p className="text-white/70 text-sm">Access to employee features and organization tools</p>
                  </div>
                </button>

                {/* HR Access */}
                <button
                  onClick={() => {
                    console.log('HR access requested from Settings page')
                    handleRequestAccess('hr')
                  }}
                  disabled={isRequestingAccess}
                  className="p-6 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl hover:border-blue-400/50 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center">
                    <UserCheck className="w-12 h-12 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-lg font-semibold text-white mb-2">HR Access</h3>
                    <p className="text-white/70 text-sm">Access to HR management and employee oversight</p>
                    {isRequestingAccess && (
                      <div className="mt-3 text-blue-400 text-sm">Processing request...</div>
                    )}
                  </div>
                </button>

                {/* Counsellor Access */}
                <button
                  onClick={() => {
                    console.log('Counsellor access requested from Settings page')
                    handleRequestAccess('counsellor')
                  }}
                  disabled={isRequestingAccess}
                  className="p-6 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl hover:border-orange-400/50 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-orange-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-lg font-semibold text-white mb-2">Counsellor Access</h3>
                    <p className="text-white/70 text-sm">Access to counselling and mental health tools</p>
                    {isRequestingAccess && (
                      <div className="mt-3 text-orange-400 text-sm">Processing request...</div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Elevated Access Message */}
          {user?.role !== 'user' && (
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="text-center">
                <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">You Already Have Elevated Access</h2>
                <p className="text-white/70">You currently have {user?.role?.toUpperCase()} access. No additional access is needed.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleTabSwitch = (tab: Tab) => {
    setActiveTab(tab)
    // Always reset assessment view when switching tabs to prevent UI mingling
    setAssessmentView('main')
    // Clear any expanded rows when switching tabs
    setExpandedRows(new Set())
  }

  const renderMainContent = () => {
    console.log('Rendering main content, activeTab:', activeTab)
    switch (activeTab) {
      case 'assessment':
        return renderAssessmentContent()
      case 'history':
        return renderHistoryContent()
      case 'support':
        return <EmployeeSupport />
      case 'hr':
        return <HRDashboard user={user} />
      case 'settings':
        return renderSettingsContent()
      default:
        return renderAssessmentContent()
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex overflow-hidden relative">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:relative w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex-col h-full overflow-hidden">
        {/* Background overlay to ensure consistent color */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl pointer-events-none"></div>
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 relative z-10 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Mind Acuity</span>
          </div>
          <div className="flex items-center space-x-2 text-white/70">
            <User className="w-4 h-4" />
            <span className="text-sm truncate">{user?.full_name || 'User'}</span>
            {user?.role && user.role !== 'user' && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'hr' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                user.role === 'employee' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                user.role === 'counsellor' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}>
                {user.role.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 p-3 space-y-2 relative z-10 overflow-y-auto min-h-0">
          <button
            onClick={() => handleTabSwitch('assessment')}
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
            onClick={() => handleTabSwitch('history')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="font-medium text-sm">Assessment History</span>
          </button>

          {/* Employee Support - Only show if user is employee */}
          {user?.role === 'employee' && (
            <button
              onClick={() => handleTabSwitch('support')}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'support'
                  ? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium text-sm">Employee Support</span>
            </button>
          )}

          {/* HR Dashboard - Only show if user is HR */}
          {user?.role === 'hr' && (
            <button
              onClick={() => handleTabSwitch('hr')}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'hr'
                  ? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="font-medium text-sm">HR Dashboard</span>
            </button>
          )}

          {/* Admin Navigation - Only show if user is admin */}
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5"
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium text-sm">Admin Panel</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={() => handleTabSwitch('settings')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium text-sm">Settings</span>
          </button>
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-white/10 relative z-10 flex-shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl pointer-events-none"></div>
            
            {/* Header */}
            <div className="p-4 border-b border-white/10 relative z-10 flex-shrink-0">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Mind Acuity</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <User className="w-4 h-4" />
                <span className="text-sm truncate">{user?.full_name || 'User'}</span>
                {user?.role && user.role !== 'user' && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'hr' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    user.role === 'employee' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                    user.role === 'counsellor' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                    user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex-1 p-3 space-y-2 relative z-10 overflow-y-auto min-h-0">
              <button
                onClick={() => {
                  handleTabSwitch('assessment')
                  setIsSidebarOpen(false)
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
                  handleTabSwitch('history')
                  setIsSidebarOpen(false)
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

              {/* Employee Support - Only show if user is employee */}
              {user?.role === 'employee' && (
                <button
                  onClick={() => {
                    handleTabSwitch('support')
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === 'support'
                      ? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium text-sm">Employee Support</span>
                </button>
              )}

              {/* HR Dashboard - Only show if user is HR */}
              {user?.role === 'hr' && (
                <button
                  onClick={() => {
                    handleTabSwitch('hr')
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === 'hr'
                      ? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-sm">HR Dashboard</span>
                </button>
              )}

              {/* Admin Navigation - Only show if user is admin */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    navigate('/admin')
                    setIsSidebarOpen(false)
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5"
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium text-sm">Admin Panel</span>
                </button>
              )}

              {/* Settings Button */}
              <button
                onClick={() => {
                  handleTabSwitch('settings')
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium text-sm">Settings</span>
              </button>
            </div>

            {/* Logout Button */}
            <div className="p-3 border-t border-white/10 relative z-10 flex-shrink-0">
              <button
                onClick={() => {
                  onLogout()
                  setIsSidebarOpen(false)
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </div>
      </div>
      
      {/* Employee Request Modal */}
      <EmployeeRequestModal onRoleUpdate={(newRole) => {
        console.log('Employee role updated to:', newRole)
        // Update the user role in the current component
        if (user) {
          user.role = newRole
        }
      }} />
    </div>
  )
}

export default Dashboard 