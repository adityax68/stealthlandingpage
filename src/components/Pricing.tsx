import React, { useState } from 'react'
import { Shield, Zap, CheckCircle, CreditCard } from 'lucide-react'
import { sessionChatService } from '../services/sessionChatService'
import SubscriptionSuccessModal from './SubscriptionSuccessModal'

const Pricing: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic')
  const [accessCode, setAccessCode] = useState('')
  const [showAccessCodeInput, setShowAccessCodeInput] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [generatedAccessCode, setGeneratedAccessCode] = useState('')
  const [generatedPlanType, setGeneratedPlanType] = useState('')

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$5',
      messages: '10 messages',
      description: 'Perfect for regular users',
      features: ['10 messages total', 'Mental health support', 'Anonymous chat'],
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      cardGradient: 'from-blue-500/40 via-blue-600/30 to-blue-500/20'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$15',
      messages: '20 messages',
      description: 'For heavy users',
      features: ['20 messages', 'Priority support', 'Advanced features'],
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      cardGradient: 'from-purple-500/40 via-purple-600/30 to-purple-500/20'
    }
  ]

  const handleSubscribe = async () => {
    setIsLoading(true)
    setError('')

    try {
      const subscription = await sessionChatService.createSubscription(selectedPlan)
      
      // Store the subscription data and show success modal
      setGeneratedAccessCode(subscription.access_code)
      setGeneratedPlanType(selectedPlan)
      setShowSuccessModal(true)
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create subscription. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccessCodeSubmit = async () => {
    if (!accessCode.trim()) {
      setError('Please enter an access code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await sessionChatService.validateAccessCode(accessCode)
      
      if (response.success && response.subscription_token) {
        // Store the subscription data and show success modal
        setGeneratedAccessCode(accessCode)
        setGeneratedPlanType(response.plan_type || 'basic')
        setShowSuccessModal(true)
        
      } else {
        setError(response.message || 'Invalid access code')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to validate access code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueToChat = () => {
    // Close the modal
    setShowSuccessModal(false)
    
    // Trigger a custom event to open the chatbot (without applying subscription)
    window.dispatchEvent(new CustomEvent('openChatbot'))
  }

  return (
    <section className="py-12 md:py-20 relative overflow-hidden" id="pricing">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-br from-secondary-start/20 to-secondary-end/20 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="block gradient-text">Choose Your</span>
            <span className="block gradient-text">Perfect Plan</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto px-4">
            Select the plan that best fits your mental health journey. 
            All plans include our advanced AI-powered assessment and support.
          </p>
        </div>


        {!showAccessCodeInput ? (
          <>
            {/* Plan Selection */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
              {plans.map((plan) => {
                const Icon = plan.icon
                const isSelected = selectedPlan === plan.id
                
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as 'basic' | 'premium')}
                    className={`relative p-8 border-2 rounded-3xl cursor-pointer transition-all duration-300 group ${
                      isSelected
                        ? 'border-primary-start bg-gradient-to-br from-primary-start/20 to-primary-end/20 shadow-2xl shadow-primary-start/20'
                        : 'border-white/20 hover:border-white/40 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-6 right-6">
                        <div className="w-8 h-8 bg-primary-start rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-3">{plan.name}</h3>
                      <p className="text-white/70 mb-6">{plan.description}</p>
                      
                      <div className="text-4xl font-bold text-white mb-2">{plan.price}</div>
                      <div className="text-white/60 mb-8">{plan.messages}</div>
                      
                      <ul className="space-y-3 text-left">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-white/80">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-primary-start to-primary-end text-white py-4 px-8 rounded-2xl font-semibold hover:from-primary-end hover:to-primary-start disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <CreditCard className="w-5 h-5 mr-2" />
                )}
                Subscribe Now
              </button>
              
              <button
                onClick={() => setShowAccessCodeInput(true)}
                className="flex-1 bg-white/10 text-white py-4 px-8 rounded-2xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                I Have an Access Code
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Access Code Input */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">Enter Access Code</h3>
              <p className="text-white/70 text-lg">
                Already have a subscription? Enter your code below.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="e.g., BASIC-ABC123"
                  className="w-full px-6 py-4 border-2 border-white/20 rounded-2xl focus:ring-2 focus:ring-primary-start focus:border-primary-start text-center font-mono text-lg bg-black/40 backdrop-blur-xl text-white placeholder-white/50"
                  maxLength={20}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAccessCodeSubmit}
                  disabled={isLoading || !accessCode.trim()}
                  className="flex-1 bg-gradient-to-r from-primary-start to-primary-end text-white py-4 px-6 rounded-2xl font-semibold hover:from-primary-end hover:to-primary-start disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    'Validate Code'
                  )}
                </button>
                
                <button
                  onClick={() => setShowAccessCodeInput(false)}
                  className="px-6 py-4 text-white/70 hover:text-white transition-colors font-medium"
                >
                  Back
                </button>
              </div>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-8 p-6 bg-red-500/20 border border-red-500/30 rounded-2xl max-w-md mx-auto">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <SubscriptionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onContinueToChat={handleContinueToChat}
        accessCode={generatedAccessCode}
        planType={generatedPlanType}
      />
    </section>
  )
}

export default Pricing
