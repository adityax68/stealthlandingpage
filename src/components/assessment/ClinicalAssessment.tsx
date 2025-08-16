import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'

interface QuestionResponse {
  question_id: number
  response: number
}

interface ClinicalAssessmentProps {
  assessmentType: 'phq9' | 'gad7' | 'pss10'
  onComplete: (results: any) => void
  onBack: () => void
}

const ClinicalAssessment: React.FC<ClinicalAssessmentProps> = ({ 
  assessmentType, 
  onComplete, 
  onBack 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questions, setQuestions] = useState<string[]>([])
  const [responseOptions, setResponseOptions] = useState<string[]>([])

  useEffect(() => {
    loadQuestions()
  }, [assessmentType])

  const loadQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/clinical/questions/${assessmentType}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
        setResponseOptions(data.response_options)
      }
    } catch (error) {
      console.error('Error loading questions:', error)
      // Fallback to hardcoded questions
      setQuestions(getFallbackQuestions())
      setResponseOptions(getFallbackResponseOptions())
    }
  }

  const getFallbackQuestions = (): string[] => {
    switch (assessmentType) {
      case 'phq9':
        return [
          "Little interest or pleasure in doing things",
          "Feeling down, depressed, or hopeless",
          "Trouble falling or staying asleep, or sleeping too much",
          "Feeling tired or having little energy",
          "Poor appetite or overeating",
          "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
          "Trouble concentrating on things, such as reading the newspaper or watching television",
          "Moving or speaking slowly enough that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
          "Thoughts that you would be better off dead or of hurting yourself in some way"
        ]
      case 'gad7':
        return [
          "Feeling nervous, anxious, or on edge",
          "Not being able to stop or control worrying",
          "Worrying too much about different things",
          "Trouble relaxing",
          "Being so restless that it's hard to sit still",
          "Becoming easily annoyed or irritable",
          "Feeling afraid as if something awful might happen"
        ]
      case 'pss10':
        return [
          "In the last month, how often have you been upset because of something that happened unexpectedly?",
          "In the last month, how often have you felt that you were unable to control the important things in your life?",
          "In the last month, how often have you felt nervous and stressed?",
          "In the last month, how often have you felt confident about your ability to handle your personal problems?",
          "In the last month, how often have you felt that things were going your way?",
          "In the last month, how often have you found that you could not cope with all the things that you had to do?",
          "In the last month, how often have you been able to control irritations in your life?",
          "In the last month, how often have you felt that you were on top of things?",
          "In the last month, how often have you been angered because of things that happened that were outside of your control?",
          "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
        ]
      default:
        return []
    }
  }

  const getFallbackResponseOptions = (): string[] => {
    if (assessmentType === 'pss10') {
      return ["Never", "Almost never", "Sometimes", "Fairly often", "Very often"]
    } else {
      return ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    }
  }

  const getAssessmentTitle = () => {
    switch (assessmentType) {
      case 'phq9': return 'PHQ-9 Depression Assessment'
      case 'gad7': return 'GAD-7 Anxiety Assessment'
      case 'pss10': return 'PSS-10 Stress Assessment'
      default: return 'Clinical Assessment'
    }
  }

  const getAssessmentDescription = () => {
    switch (assessmentType) {
      case 'phq9': return 'Patient Health Questionnaire-9: A validated tool for assessing depression severity'
      case 'gad7': return 'Generalized Anxiety Disorder-7: A validated tool for assessing anxiety severity'
      case 'pss10': return 'Perceived Stress Scale-10: A validated tool for assessing stress levels'
      default: return 'Clinical assessment'
    }
  }

  const handleAnswer = (value: number) => {
    const newResponses = [...responses]
    const existingIndex = newResponses.findIndex(r => r.question_id === currentQuestion + 1)
    
    if (existingIndex >= 0) {
      newResponses[existingIndex].response = value
    } else {
      newResponses.push({ question_id: currentQuestion + 1, response: value })
    }
    
    setResponses(newResponses)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
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
    setIsSubmitting(true)
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/clinical/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          assessment_type: assessmentType,
          responses: responses
        }),
      })

      if (response.ok) {
        const results = await response.json()
        onComplete(results)
      } else {
        const errorData = await response.json()
        console.error('Assessment submission failed:', errorData)
        // Fallback to local analysis
        const localResults = analyzeResultsLocally()
        onComplete(localResults)
      }
    } catch (error) {
      console.error('Error submitting assessment:', error)
      // Fallback to local analysis
      const localResults = analyzeResultsLocally()
      onComplete(localResults)
    } finally {
      setIsSubmitting(false)
    }
  }

  const analyzeResultsLocally = () => {
    const totalScore = responses.reduce((sum, r) => sum + r.response, 0)
    let severity = 'minimal'
    let interpretation = 'No significant concerns detected'

    switch (assessmentType) {
      case 'phq9':
        if (totalScore <= 4) severity = 'minimal'
        else if (totalScore <= 9) severity = 'mild'
        else if (totalScore <= 14) severity = 'moderate'
        else if (totalScore <= 19) severity = 'moderately_severe'
        else severity = 'severe'
        break
      case 'gad7':
        if (totalScore <= 4) severity = 'minimal'
        else if (totalScore <= 9) severity = 'mild'
        else if (totalScore <= 14) severity = 'moderate'
        else severity = 'severe'
        break
      case 'pss10':
        if (totalScore <= 13) severity = 'low'
        else if (totalScore <= 26) severity = 'moderate'
        else severity = 'high'
        break
    }

    return {
      assessment_type: assessmentType.toUpperCase(),
      total_score: totalScore,
      severity_level: severity,
      interpretation: interpretation,
      responses: responses
    }
  }

  const currentResponse = responses.find(r => r.question_id === currentQuestion + 1)?.response
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const question = questions[currentQuestion]

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading questions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-3xl font-bold text-white mb-2">{getAssessmentTitle()}</h1>
            <p className="text-white/70">{getAssessmentDescription()}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-white/70 text-sm mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-start to-primary-end h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            {question}
          </h2>

          {/* Response Options */}
          <div className="space-y-4">
            {responseOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-300 ${
                  currentResponse === index
                    ? 'bg-gradient-to-r from-primary-start to-primary-end border-primary-start text-white'
                    : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {currentResponse === index && (
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
            className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? (
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

export default ClinicalAssessment 