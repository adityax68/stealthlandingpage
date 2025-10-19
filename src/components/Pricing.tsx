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
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Select the plan that best fits your mental health journey. 
            All plans include our advanced AI-powered assessment and support.
          </p>
        </div>


        {/* Plan Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            
            return (
              <div
                key={plan.id}
                className="relative p-8 border-2 rounded-3xl transition-all duration-300 group border-primary-start/30 bg-gradient-to-br from-primary-start/15 to-primary-end/10 backdrop-blur-xl"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{plan.name}</h3>
                  <p className="text-gray-700 mb-6">{plan.description}</p>
                  
                  <div className="text-4xl font-bold text-gray-800 mb-2">{plan.price}</div>
                  <div className="text-gray-600 mb-8">{plan.messages}</div>
                  
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
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
