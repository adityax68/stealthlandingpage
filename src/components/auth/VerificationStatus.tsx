import React, { useState, useEffect } from 'react'
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { API_ENDPOINTS } from '../../config/api'

interface VerificationStatusProps {
  email: string
  onResendVerification?: (email: string) => void
  className?: string
}

interface VerificationStatusData {
  is_verified: boolean
  verification_sent: boolean
  can_resend: boolean
  last_attempt?: string
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ 
  email, 
  onResendVerification,
  className = '' 
}) => {
  const [status, setStatus] = useState<VerificationStatusData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')

  const fetchVerificationStatus = async () => {
    if (!email) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(API_ENDPOINTS.VERIFICATION_STATUS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus(data)
      } else {
        setError(data.detail || 'Failed to check verification status')
      }
    } catch (err) {
      console.error('Verification status error:', err)
      setError('Connection error. Please check your internet and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email || !onResendVerification) return
    
    setIsResending(true)
    setError('')
    
    try {
      await onResendVerification(email)
      // Refresh status after resending
      await fetchVerificationStatus()
    } catch (err) {
      console.error('Resend verification error:', err)
      setError('Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  useEffect(() => {
    fetchVerificationStatus()
  }, [email])

  if (isLoading) {
    return (
      <div className={`p-4 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
          <span className="text-sm text-gray-600">Checking verification status...</span>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">Unable to check verification status</span>
        </div>
      </div>
    )
  }

  if (status.is_verified) {
    return (
      <div className={`p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-700">Email verified successfully</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-yellow-700 font-medium">Email verification required</span>
        </div>
        
        <p className="text-sm text-yellow-600">
          Please check your email and click the verification link to activate your account.
        </p>

        {error && (
          <div className="p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        {status.can_resend && onResendVerification && (
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="flex items-center space-x-2 px-3 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail className="w-3 h-3" />
                <span>Resend verification email</span>
              </>
            )}
          </button>
        )}

        {status.last_attempt && (
          <p className="text-xs text-yellow-500">
            Last verification attempt: {new Date(status.last_attempt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}

export default VerificationStatus
