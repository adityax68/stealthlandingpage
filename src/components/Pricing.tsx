import React from 'react'
import { Shield, Zap, CheckCircle } from 'lucide-react'

const Pricing: React.FC = () => {

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$5',
      messages: '15 messages',
      description: 'Perfect for regular users',
      features: ['15 messages total', 'Mental health support', 'Anonymous chat'],
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


  return (
    <section className="py-8 md:py-12 relative overflow-hidden bg-gray-50/50" id="pricing">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            <span className="gradient-text">Choose Your Perfect Plan</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Select the plan that best fits your mental health journey. 
            All plans include our advanced AI-powered assessment and support.
          </p>
        </div>

        {/* Plan Selection */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            
            return (
              <div
                key={plan.id}
                className="relative group"
              >
                {/* Purplish Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"></div>
                
                <div className="relative bg-white border border-gray-200 hover:border-purple-300 rounded-xl p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="text-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="text-3xl font-bold text-gray-800 mb-1">{plan.price}</div>
                  <div className="text-sm text-gray-500 mb-5">{plan.messages}</div>
                  
                  <ul className="space-y-2 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default Pricing
