import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Brain, Activity, Heart, Zap, AlertTriangle } from 'lucide-react'
import { API_ENDPOINTS } from '../../config/api'

interface QuestionResponse {
  question_id: number
  response: number
  category: 'depression' | 'anxiety' | 'stress'
}

interface ComprehensiveAssessmentProps {
  onComplete: (results: any) => void
  onBack: () => void
}

const ComprehensiveAssessment: React.FC<ComprehensiveAssessmentProps> = ({ 
  onComplete, 
  onBack 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questions, setQuestions] = useState<Array<{
    id: number
    text: string
    category: 'depression' | 'anxiety' | 'stress'
    responseOptions: string[]
  }>>([])

  useEffect(() => {
    loadAllQuestions()
  }, [])

  const loadAllQuestions = async () => {
    try {
      // Load questions from all three assessments
              const [phq9Response, gad7Response, pss10Response] = await Promise.all([
          fetch(API_ENDPOINTS.QUESTIONS_PHQ9, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(API_ENDPOINTS.QUESTIONS_GAD7, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(API_ENDPOINTS.QUESTIONS_PSS10, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ])

      const phq9Data = phq9Response.ok ? await phq9Response.json() : getFallbackPHQ9()
      const gad7Data = gad7Response.ok ? await gad7Response.json() : getFallbackGAD7()
      const pss10Data = pss10Response.ok ? await pss10Response.json() : getFallbackPSS10()

      // Combine all questions
      const allQuestions = [
        ...phq9Data.questions.map((q: string, i: number) => ({
          id: i + 1,
          text: q,
          category: 'depression' as const,
          responseOptions: phq9Data.response_options
        })),
        ...gad7Data.questions.map((q: string, i: number) => ({
          id: i + 10,
          text: q,
          category: 'anxiety' as const,
          responseOptions: gad7Data.response_options
        })),
        ...pss10Data.questions.map((q: string, i: number) => ({
          id: i + 17,
          text: q,
          category: 'stress' as const,
          responseOptions: pss10Data.response_options
        }))
      ]

      setQuestions(allQuestions)
    } catch (error) {
      console.error('Error loading questions:', error)
      // Fallback to hardcoded questions
      setQuestions(getFallbackQuestions())
    }
  }

  const getFallbackPHQ9 = () => ({
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
      "Trouble concentrating on things, such as reading the newspaper or watching television",
      "Moving or speaking slowly enough that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
      "Thoughts that you would be better off dead or of hurting yourself in some way"
    ],
    response_options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  })

  const getFallbackGAD7 = () => ({
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it's hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen"
    ],
    response_options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  })

  const getFallbackPSS10 = () => ({
    questions: [
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
    ],
    response_options: ["Never", "Almost never", "Sometimes", "Fairly often", "Very often"]
  })

  const getFallbackQuestions = () => {
    const phq9 = getFallbackPHQ9()
    const gad7 = getFallbackGAD7()
    const pss10 = getFallbackPSS10()

    return [
      ...phq9.questions.map((q: string, i: number) => ({
        id: i + 1,
        text: q,
        category: 'depression' as const,
        responseOptions: phq9.response_options
      })),
      ...gad7.questions.map((q: string, i: number) => ({
        id: i + 10,
        text: q,
        category: 'anxiety' as const,
        responseOptions: gad7.response_options
      })),
      ...pss10.questions.map((q: string, i: number) => ({
        id: i + 17,
        text: q,
        category: 'stress' as const,
        responseOptions: pss10.response_options
      }))
    ]
  }

  const handleAnswer = (value: number) => {
    const newResponses = [...responses]
    const existingIndex = newResponses.findIndex(r => r.question_id === currentQuestion + 1)
    const currentQ = questions[currentQuestion]
    
    if (existingIndex >= 0) {
      newResponses[existingIndex].response = value
    } else {
      newResponses.push({ 
        question_id: currentQuestion + 1, 
        response: value,
        category: currentQ.category
      })
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
    console.log('Starting assessment submission...')
    
    try {
      console.log('Submitting assessment with responses:', responses)
      
              // Submit to comprehensive assessment endpoint
        const response = await fetch(API_ENDPOINTS.CLINICAL_COMPREHENSIVE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          responses: responses
        }),
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const results = await response.json()
        console.log('Assessment results:', results)
        
        // Validate that results have the expected structure
        if (results.depression && results.anxiety && results.stress) {
        onComplete(results)
        } else {
          console.error('Invalid results structure:', results)
          // Fallback to local analysis
          const localResults = analyzeResultsLocally()
          onComplete(localResults)
        }
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
    // Separate responses by category
    const depressionResponses = responses.filter(r => r.category === 'depression')
    const anxietyResponses = responses.filter(r => r.category === 'anxiety')
    const stressResponses = responses.filter(r => r.category === 'stress')

    // Calculate scores
    const depressionScore = depressionResponses.reduce((sum, r) => sum + r.response, 0)
    const anxietyScore = anxietyResponses.reduce((sum, r) => sum + r.response, 0)
    
    // PSS-10 has reverse scoring for questions 4, 5, 7, 8 (which are questions 20, 21, 23, 24 in our combined list)
    let stressScore = 0
    stressResponses.forEach((r) => {
      const questionNumber = r.question_id - 16 // PSS-10 questions start at 17
      if ([4, 5, 7, 8].includes(questionNumber)) {
        // Reverse scoring: 0→4, 1→3, 2→2, 3→1, 4→0
        stressScore += (4 - r.response)
      } else {
        stressScore += r.response
      }
    })

    // Determine severity levels
    const getDepressionSeverity = (score: number) => {
      if (score <= 4) return 'minimal'
      if (score <= 9) return 'mild'
      if (score <= 14) return 'moderate'
      if (score <= 19) return 'moderately_severe'
      return 'severe'
    }

    const getAnxietySeverity = (score: number) => {
      if (score <= 4) return 'minimal'
      if (score <= 9) return 'mild'
      if (score <= 14) return 'moderate'
      return 'severe'
    }

    const getStressSeverity = (score: number) => {
      if (score <= 13) return 'low'
      if (score <= 26) return 'moderate'
      return 'high'
    }

    return {
      assessment_type: "COMPREHENSIVE",
      assessment_name: "Comprehensive Mental Health Assessment",
      total_score: Math.round((depressionScore + anxietyScore + stressScore) / 3),
      max_score: 88, // 27 + 21 + 40
      depression: {
        score: depressionScore,
        max_score: 27,
        severity: getDepressionSeverity(depressionScore),
        interpretation: getDepressionInterpretation(depressionScore)
      },
      anxiety: {
        score: anxietyScore,
        max_score: 21,
        severity: getAnxietySeverity(anxietyScore),
        interpretation: getAnxietyInterpretation(anxietyScore)
      },
      stress: {
        score: stressScore,
        max_score: 40,
        severity: getStressSeverity(stressScore),
        interpretation: getStressInterpretation(stressScore)
      },
      responses: responses,
      created_at: new Date().toISOString()
    }
  }

  const getDepressionInterpretation = (score: number) => {
    if (score <= 4) return "Minimal depression - No treatment needed"
    if (score <= 9) return "Mild depression - Watchful waiting; repeat assessment"
    if (score <= 14) return "Moderate depression - Treatment plan, counseling, follow-up"
    if (score <= 19) return "Moderately severe depression - Active treatment with medication and/or therapy"
    return "Severe depression - Immediate treatment, medication and therapy"
  }

  const getAnxietyInterpretation = (score: number) => {
    if (score <= 4) return "Minimal anxiety - No treatment needed"
    if (score <= 9) return "Mild anxiety - Watchful waiting; repeat assessment"
    if (score <= 14) return "Moderate anxiety - Treatment plan, counseling, follow-up"
    return "Severe anxiety - Active treatment with medication and/or therapy"
  }

  const getStressInterpretation = (score: number) => {
    if (score <= 13) return "Low stress - Good stress management"
    if (score <= 26) return "Moderate stress - Consider stress management techniques"
    return "High stress - Consider professional help for stress management"
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'depression': return 'text-red-400'
      case 'anxiety': return 'text-yellow-400'
      case 'stress': return 'text-blue-400'
      default: return 'text-white'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'depression': return <Heart className="w-5 h-5 text-red-400" />
      case 'anxiety': return <Zap className="w-5 h-5 text-yellow-400" />
      case 'stress': return <Activity className="w-5 h-5 text-blue-400" />
      default: return <Brain className="w-5 h-5 text-white" />
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
            <h1 className="text-3xl font-bold text-white mb-2">Comprehensive Mental Health Assessment</h1>
            <p className="text-white/70">Complete assessment covering depression, anxiety, and stress</p>
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
          {/* Category Indicator */}
          <div className="flex items-center mb-4">
            {getCategoryIcon(question.category)}
            <span className={`ml-2 text-sm font-medium ${getCategoryColor(question.category)}`}>
              {question.category.toUpperCase()} Assessment
            </span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-6">
            {question.text}
          </h2>

          {/* Response Options */}
          <div className="space-y-4">
            {question.responseOptions.map((option, index) => (
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

export default ComprehensiveAssessment 