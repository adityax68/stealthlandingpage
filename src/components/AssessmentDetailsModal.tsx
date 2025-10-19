import React from 'react'
import { X, Brain, Heart, Zap, Activity, CheckCircle, AlertTriangle } from 'lucide-react'

interface AssessmentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  assessment: any
}

const AssessmentDetailsModal: React.FC<AssessmentDetailsModalProps> = ({ isOpen, onClose, assessment }) => {
  if (!isOpen || !assessment) return null

  const getSeverityColor = (severity: string) => {
    if (!severity || typeof severity !== 'string') {
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    
    const level = severity.toLowerCase()
    if (level === 'severe' || level === 'high') {
      return 'bg-red-500/20 text-red-300 border-red-500/30'
    } else if (level === 'moderate' || level === 'moderately_severe') {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    } else {
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    }
  }

  const getSeverityIcon = (severity: string) => {
    if (!severity || typeof severity !== 'string') {
      return <Brain className="w-6 h-6 text-gray-400" />
    }
    
    const level = severity.toLowerCase()
    if (level === 'severe' || level === 'high') {
      return <AlertTriangle className="w-6 h-6 text-red-400" />
    } else if (level === 'moderate' || level === 'moderately_severe') {
      return <AlertTriangle className="w-6 h-6 text-yellow-400" />
    } else {
      return <CheckCircle className="w-6 h-6 text-green-400" />
    }
  }

  const getAssessmentIcon = (type: string) => {
    if (!type || typeof type !== 'string') {
      return <Brain className="w-8 h-8 text-gray-400" />
    }
    
    const level = type.toLowerCase()
    if (level.includes('phq')) {
      return <Heart className="w-8 h-8 text-red-400" />
    } else if (level.includes('gad')) {
      return <Zap className="w-8 h-8 text-yellow-400" />
    } else if (level.includes('pss')) {
      return <Activity className="w-8 h-8 text-blue-400" />
    } else {
      return <Brain className="w-8 h-8 text-purple-400" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-start to-primary-end p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                {getAssessmentIcon(assessment.assessment_name)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {assessment.category === 'bot' ? 'Bot Assessment' : `${assessment.assessment_name} Assessment`}
                </h2>
                <p className="text-white/80">
                  Completed on {new Date(assessment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assessment Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Assessment Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Assessment Type:</span>
                  <span className="font-medium text-gray-800">
                    {assessment.category === 'bot' ? 'Bot Assessment' : assessment.assessment_name}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Completion Date:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(assessment.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Completion Time:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(assessment.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Score & Results */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {assessment.category === 'bot' ? 'Assessment Results' : 'Score Breakdown'}
              </h3>
              
              {assessment.category === 'bot' ? (
                // Bot Assessment Results
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Assessment Summary</h4>
                    <p className="text-blue-800 text-sm">{assessment.assessment_summary}</p>
                  </div>
                  
                  {/* Full Assessment Data */}
                  {assessment.assessment_data && (
                    <div className="space-y-4">
                      {/* Mental Conditions with Full Details */}
                      {assessment.assessment_data.mental_conditions && Array.isArray(assessment.assessment_data.mental_conditions) && assessment.assessment_data.mental_conditions.length > 0 && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3">Detected Conditions</h4>
                          <div className="space-y-3">
                            {assessment.assessment_data.mental_conditions.map((condition: any, index: number) => (
                              <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium text-gray-900">{condition.condition}</h5>
                                  <div className="flex space-x-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      condition.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                                      condition.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {condition.severity}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      condition.confidence === 'High' ? 'bg-blue-100 text-blue-800' :
                                      condition.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {condition.confidence} Confidence
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">{condition.evidence}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Severity Levels */}
                      {assessment.assessment_data.severity_levels && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3">Severity Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Overall Severity:</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                assessment.assessment_data.severity_levels.overall_severity === 'Severe' ? 'bg-red-100 text-red-800' :
                                assessment.assessment_data.severity_levels.overall_severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {assessment.assessment_data.severity_levels.overall_severity}
                              </span>
                            </div>
                            
                            {assessment.assessment_data.severity_levels.risk_factors && assessment.assessment_data.severity_levels.risk_factors.length > 0 && (
                              <div className="mt-3">
                                <h5 className="font-medium text-gray-700 mb-2">Risk Factors:</h5>
                                <ul className="list-disc list-inside space-y-1">
                                  {assessment.assessment_data.severity_levels.risk_factors.map((factor: string, index: number) => (
                                    <li key={index} className="text-sm text-gray-600">{factor}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {assessment.assessment_data.severity_levels.protective_factors && assessment.assessment_data.severity_levels.protective_factors.length > 0 && (
                              <div className="mt-3">
                                <h5 className="font-medium text-gray-700 mb-2">Protective Factors:</h5>
                                <ul className="list-disc list-inside space-y-1">
                                  {assessment.assessment_data.severity_levels.protective_factors.map((factor: string, index: number) => (
                                    <li key={index} className="text-sm text-gray-600">{factor}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Critical Status with Reason */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Critical Status:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            assessment.is_critical ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {assessment.is_critical ? 'Critical' : 'Non-Critical'}
                          </span>
                        </div>
                        {assessment.assessment_data.critical_reason && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Reason:</strong> {assessment.assessment_data.critical_reason}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Fallback for old data format */}
                  {!assessment.assessment_data && assessment.mental_conditions && Array.isArray(assessment.mental_conditions) && assessment.mental_conditions.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Detected Conditions</h4>
                      <div className="space-y-2">
                        {assessment.mental_conditions.map((condition: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                            <span className="text-sm font-medium">{condition.condition}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              condition.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                              condition.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {condition.severity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Clinical Assessment Results
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Total Score:</span>
                      <span className="text-2xl font-bold text-primary-start">
                        {assessment.total_score}/{assessment.max_score}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary-start to-primary-end h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(assessment.total_score / assessment.max_score) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Overall Severity:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(assessment.severity_level)}`}>
                        {assessment.severity_level ? assessment.severity_level.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interpretation/Summary */}
          <div className="mt-6 p-6 bg-gradient-to-r from-primary-start/10 to-primary-end/10 rounded-lg border border-primary-start/20">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              {getSeverityIcon(assessment.severity_level)}
              <span className="ml-2">
                {assessment.category === 'bot' ? 'Assessment Summary' : 'Interpretation'}
              </span>
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {assessment.category === 'bot' ? assessment.assessment_summary : assessment.interpretation}
            </p>
            
            {/* Show additional metadata for bot assessments */}
            {assessment.category === 'bot' && assessment.assessment_data && (
              <div className="mt-4 pt-4 border-t border-primary-start/20">
                <h5 className="font-semibold text-gray-800 mb-2">Additional Assessment Details</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Session ID:</span>
                    <span className="ml-2 text-gray-800">{assessment.session_identifier}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Assessment ID:</span>
                    <span className="ml-2 text-gray-800">{assessment.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Generated:</span>
                    <span className="ml-2 text-gray-800">
                      {new Date(assessment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Data Completeness:</span>
                    <span className="ml-2 text-gray-800">
                      {assessment.assessment_data ? 'Full Metadata Available' : 'Basic Data Only'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssessmentDetailsModal
