import React from 'react'
import { Brain, MessageCircle, BarChart3, Target, Shield, Clock } from 'lucide-react'

const Features: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Assessment',
      description: 'Advanced machine learning algorithms analyze your responses to detect patterns in stress, anxiety, and depression levels.',
      gradient: 'from-primary-start to-primary-end',
      cardGradient: 'from-primary-start/40 via-primary-end/30 to-primary-start/20'
    },
    {
      icon: MessageCircle,
      title: 'Intelligent Conversation',
      description: 'Natural language processing enables meaningful conversations that adapt to your emotional state and needs.',
      gradient: 'from-secondary-start to-secondary-end',
      cardGradient: 'from-secondary-start/40 via-secondary-end/30 to-secondary-start/20'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track your mental health progress with detailed analytics and insights delivered in real-time.',
      gradient: 'from-accent-start to-accent-end',
      cardGradient: 'from-accent-start/40 via-accent-end/30 to-accent-start/20'
    },
    {
      icon: Target,
      title: 'Personalized Solutions',
      description: 'Get tailored recommendations and coping strategies based on your unique mental health profile.',
      gradient: 'from-blue-400 to-cyan-400',
      cardGradient: 'from-blue-400/40 via-cyan-400/30 to-blue-400/20'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your mental health data is encrypted and protected with enterprise-grade security measures.',
      gradient: 'from-green-400 to-teal-400',
      cardGradient: 'from-green-400/40 via-teal-400/30 to-green-400/20'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access mental health support anytime, anywhere with our always-available AI companion.',
      gradient: 'from-pink-400 to-yellow-400',
      cardGradient: 'from-pink-400/40 via-yellow-400/30 to-pink-400/20'
    }
  ]

  return (
    <section className="py-8 md:py-12 relative overflow-hidden" id="features">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            <span className="gradient-text">Why Choose Mind Acuity?</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Experience the next generation of mental health technology designed to understand, 
            support, and empower your emotional well-being.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={feature.title}
                className="group relative transform transition-all duration-300 hover:scale-105"
              >
                {/* Purplish Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"></div>
                
                {/* Main Card Content */}
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-purple-300 rounded-xl p-4 md:p-5 h-full shadow-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                  <div className="space-y-2 md:space-y-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                      <IconComponent 
                        size={20} 
                        className="text-white" 
                      />
                    </div>
                    
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
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

export default Features 