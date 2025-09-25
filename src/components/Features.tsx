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
    <section className="py-12 md:py-20 relative overflow-hidden" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="block gradient-text">Why Choose</span>
            <span className="block gradient-text">Mind Acuity?</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Experience the next generation of mental health technology designed to understand, 
            support, and empower your emotional well-being.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={feature.title}
                className="group relative transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                {/* Shimmer Border Effect */}
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl p-[2px] bg-gradient-to-r from-primary-start via-secondary-start to-accent-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-full rounded-2xl md:rounded-3xl bg-gradient-to-r from-primary-start via-secondary-start to-accent-start animate-pulse"></div>
                </div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl md:rounded-3xl blur-xl scale-110 group-hover:scale-100"
                     style={{ background: `linear-gradient(135deg, ${feature.cardGradient})` }}>
                </div>
                
                {/* Main Card Content */}
                <div className="relative bg-gradient-to-br from-primary-start/20 via-primary-end/15 to-primary-start/10 backdrop-blur-xl border border-primary-start/30 rounded-2xl md:rounded-3xl p-5 md:p-6 h-full shadow-2xl group-hover:shadow-3xl group-hover:shadow-primary-start/20 transition-all duration-500">
                  <div className="space-y-3 md:space-y-4">
                    <div className={`w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r ${feature.gradient} rounded-xl md:rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-2xl group-hover:shadow-white/20 relative overflow-hidden`}>
                      {/* 3D Icon Container */}
                      <div className="relative z-10">
                        <IconComponent 
                          size={20} 
                          className="md:w-7 md:h-7 text-white drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300 group-hover:scale-110" 
                        />
                      </div>
                      
                      {/* 3D Depth Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl md:rounded-2xl transform rotate-12 scale-110 opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                      
                      {/* Bottom Shadow for 3D Effect */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 rounded-b-xl md:rounded-b-2xl transform scale-x-90 group-hover:scale-x-100 transition-transform duration-300"></div>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-end group-hover:to-primary-start transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 text-sm md:text-base">
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