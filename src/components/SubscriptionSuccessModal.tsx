import React, { useState } from 'react'
import { X, CheckCircle, Copy, Check, AlertTriangle, MessageCircle } from 'lucide-react'

interface SubscriptionSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onContinueToChat: () => void
  accessCode: string
  planType: string
}

const SubscriptionSuccessModal: React.FC<SubscriptionSuccessModalProps> = ({
  isOpen,
  onClose,
  onContinueToChat,
  accessCode,
  planType
}) => {
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCopyAccessCode = async () => {
    try {
      await navigator.clipboard.writeText(accessCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy access code:', err)
    }
  }

  const handleContinueClick = async () => {
    setIsLoading(true)
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500))
      onContinueToChat()
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Subscription Created!</h2>
            <p className="text-green-100 text-sm">
              Your {planType} plan is ready to activate
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Access Code Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              Your Access Code
            </h3>
            
            <div className="relative group">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-green-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <code className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                      {accessCode}
                    </code>
                  </div>
                  
                  <button
                    onClick={handleCopyAccessCode}
                    className="ml-4 p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 group-hover:scale-105"
                    title="Copy access code"
                  >
                    {copied ? (
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">Copied!</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Copy className="w-4 h-4" />
                        <span className="text-sm font-medium">Copy</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Section */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800 mb-1">
                  Manual Activation Required
                </h4>
                <p className="text-sm text-amber-700">
                  Keep your access code safe! This is a one-time generated code that cannot be recovered. 
                  You'll need to manually activate your plan by clicking the "Upgrade" button in the chatbox header and entering this code.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleContinueClick}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Opening Chat...
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5 mr-2" />
                Open Chat & Activate Plan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionSuccessModal
