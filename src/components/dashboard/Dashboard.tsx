import React, { useState, useEffect } from 'react'
import { Brain, Activity, Heart, Zap, LogOut, User, Calendar, TrendingUp } from 'lucide-react'
import ComprehensiveAssessment from '../assessment/ComprehensiveAssessment'
import ComprehensiveResults from '../assessment/ComprehensiveResults'
import { API_ENDPOINTS } from '../../config/api'

interface DashboardProps {
  onLogout: () => void
  user: any
}

type View = 'main' | 'assessment' | 'results'

const Dashboard: React.FC<DashboardProps> = ({ onLogout, user }) => {
  const [currentView, setCurrentView] = useState<View>('main')
  const [assessmentResults, setAssessmentResults] = useState<any>(null)
  const [recentAssessments, setRecentAssessments] = useState<any[]>([])

  useEffect(() => {
    // Load recent assessments
    loadRecentAssessments()
  }, [])

  const loadRecentAssessments = async () => {
    try {
      // Load clinical assessments only
      const response = await fetch(API_ENDPOINTS.CLINICAL_ASSESSMENTS, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      const clinicalData = response.ok ? await response.json() : []
      
      // Sort by date and take recent 3
      const recentAssessments = clinicalData
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
      
      setRecentAssessments(recentAssessments)
    } catch (error) {
      console.error('Error loading assessments:', error)
    }
  }

  const handleStartAssessment = () => {
    setCurrentView('assessment')
  }

  const handleAssessmentComplete = (results: any) => {
    // Clinical assessments return data in the correct format already
    setAssessmentResults(results)
    setCurrentView('results')
    loadRecentAssessments() // Refresh the list
  }



  const handleBackToDashboard = () => {
    setCurrentView('main')
  }

  const handleNewAssessment = () => {
    setCurrentView('assessment')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    onLogout()
  }

  if (currentView === 'assessment') {
    return (
      <ComprehensiveAssessment
        onComplete={handleAssessmentComplete}
        onBack={handleBackToDashboard}
      />
    )
  }

  if (currentView === 'results') {
    return (
      <ComprehensiveResults
        results={assessmentResults}
        onBack={handleBackToDashboard}
        onNewAssessment={handleNewAssessment}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Mental Health Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white/70">
                <User className="w-4 h-4" />
                <span>{user?.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-white/70">
            Track your mental health and get personalized recommendations
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-primary-start to-primary-end p-6 rounded-2xl text-white hover:from-primary-end hover:to-primary-start transition-all duration-300 transform hover:scale-105">
            <Brain className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-1">Comprehensive Assessment</h3>
            <p className="text-sm opacity-80 mb-3">Complete mental health evaluation</p>
            <button
              onClick={handleStartAssessment}
              className="w-full p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
            >
              Start Comprehensive Assessment
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
            <Activity className="w-8 h-8 mb-3 text-blue-400" />
            <h3 className="font-semibold text-white mb-1">Stress Level</h3>
            <p className="text-sm text-white/70">Track your stress</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
            <Zap className="w-8 h-8 mb-3 text-yellow-400" />
            <h3 className="font-semibold text-white mb-1">Anxiety</h3>
            <p className="text-sm text-white/70">Monitor anxiety levels</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
            <Heart className="w-8 h-8 mb-3 text-red-400" />
            <h3 className="font-semibold text-white mb-1">Mood</h3>
            <p className="text-sm text-white/70">Track your mood</p>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Calendar className="w-6 h-6 mr-3" />
              Recent Assessments
            </h2>
            <button
              onClick={handleStartAssessment}
              className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
            >
              New Assessment
            </button>
          </div>

                    {recentAssessments.length > 0 ? (
            <div className="space-y-4">
              {recentAssessments.map((assessment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Assessment #{assessment.id}
                      </p>
                      <p className="text-white/70 text-sm">
                        {new Date(assessment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      Score: {assessment.total_score || 'N/A'}/{assessment.max_score || 'N/A'}
                    </p>
                    <p className="text-white/70 text-sm">
                      {assessment.severity_level || 'Completed'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70 mb-4">No assessments yet</p>
              <button
                onClick={handleStartAssessment}
                className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
              >
                New Assessment
              </button>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Mental Health Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-medium text-white mb-2">Practice Mindfulness</h3>
              <p className="text-white/70 text-sm">
                Take a few minutes each day to focus on your breathing and be present in the moment.
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-medium text-white mb-2">Stay Connected</h3>
              <p className="text-white/70 text-sm">
                Maintain relationships with friends and family. Social support is crucial for mental health.
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-medium text-white mb-2">Regular Exercise</h3>
              <p className="text-white/70 text-sm">
                Physical activity releases endorphins and can help reduce stress and anxiety.
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-medium text-white mb-2">Get Enough Sleep</h3>
              <p className="text-white/70 text-sm">
                Aim for 7-9 hours of quality sleep each night to support your mental well-being.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 