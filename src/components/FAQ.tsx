import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: 'What is MindAcuity AI?',
    answer: 'MindAcuity is an AI-powered mental-health companion that offers a supportive 24/7 chatbot, symptom check-ins, and (optionally) bookings with licensed clinicians. It is not a medical device or a substitute for emergency care.'
  },
  {
    question: 'Is this a crisis service?',
    answer: 'No. If you\'re in danger or considering self-harm, please use the in-app SOS to reach local helplines or call your local emergency number immediately. (In India: 112 / Kiran 1800-599-0019.)'
  },
  {
    question: 'Who are the clinicians on the platform?',
    answer: 'Only Registered Medical Practitioners (RMPs) and licensed psychologists/psychiatrists who verify identity and registration numbers. Tele-consults follow the Telemedicine Practice Guidelines (2020): clinicians identify themselves and obtain/record consent; basic records are retained as required.'
  },
  {
    question: 'How does the AI work?',
    answer: 'It uses natural-language processing to provide supportive, CBT-informed guidance. It does make diagnoses based on certain pre-trained and pre-approved tests suggested by psychologists; when signals suggest higher risk, it nudges you to seek a human clinician.'
  },
  {
    question: 'Is my data private?',
    answer: 'Yes. We follow the DPDPA, 2023. You\'ll see a clear notice explaining what we collect and why; we process personal data only with your consent (which you can withdraw), and we support access, correction, and erasure rights.'
  },
  {
    question: 'Where is my data stored and can it go overseas?',
    answer: 'We may store/process data in India and other jurisdictions not restricted by the Government of India under Section 16 DPDPA (if any such restrictions are notified).'
  },
  {
    question: 'Do you process children\'s data?',
    answer: 'Our service is not for users under 18 without verifiable parental consent. We do not conduct behavioural tracking or targeted advertising to children.'
  },
  {
    question: 'What happens if there\'s a data breach?',
    answer: 'We maintain strong security controls. If a notifiable incident occurs, we will report to CERT-In within 6 hours and inform affected users as required by law.'
  },
  {
    question: 'Can I delete my account and data?',
    answer: 'Yes. You can request deletion in-app. We\'ll also respect any legal retention requirements (e.g., telemedicine records) before erasure.'
  },
  {
    question: 'Will my chat be shared with my employer?',
    answer: 'No. For any B2B program, only aggregated, anonymised analytics may be shared. Individual chat content is not shared with employers.'
  },
  {
    question: 'How do I raise a concern?',
    answer: 'Use the in-app Grievance link or email at business@thymositsolution.com. You may also escalate to India\'s Data Protection Board as per DPDPA.'
  }
]

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Split FAQs into two columns
  const midPoint = Math.ceil(faqData.length / 2)
  const leftColumnFAQs = faqData.slice(0, midPoint)
  const rightColumnFAQs = faqData.slice(midPoint)

  const renderFAQItem = (faq: FAQItem, index: number) => (
    <div
      key={index}
      className="bg-white/80 backdrop-blur-sm border border-primary-start/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary-start/10"
    >
      <button
        onClick={() => toggleFAQ(index)}
        className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-300 hover:bg-primary-start/5"
      >
        <span className="text-gray-800 font-semibold text-base md:text-lg pr-4">
          {faq.question}
        </span>
        <div className="flex-shrink-0">
          {openIndex === index ? (
            <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-primary-start" />
          ) : (
            <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-primary-start" />
          )}
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ${
          openIndex === index ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-6 pb-5 text-gray-600 leading-relaxed">
          {faq.answer}
        </div>
      </div>
    </div>
  )

  return (
    <section id="faq" className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-primary-start/10 to-primary-end/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-secondary-start/10 to-secondary-end/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Everything you need to know about MindAcuity AI
          </p>
        </div>

        {/* FAQ Items - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            {leftColumnFAQs.map((faq, index) => renderFAQItem(faq, index))}
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            {rightColumnFAQs.map((faq, index) => renderFAQItem(faq, index + midPoint))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:business@thymositsolution.com"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-start/25"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQ

