import React, { useState } from 'react';
import { X, CreditCard, Shield, Zap, CheckCircle, Copy, Check } from 'lucide-react';
import { sessionChatService } from '../services/sessionChatService';
import type { SubscriptionResponse } from '../services/sessionChatService';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionSuccess: (subscription: SubscriptionResponse) => void;
  currentPlan?: string;
  messagesUsed?: number;
  messageLimit?: number | null;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscriptionSuccess,
  messagesUsed = 0,
  messageLimit = 5
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  const [accessCode, setAccessCode] = useState('');
  const [showAccessCodeInput, setShowAccessCodeInput] = useState(false);
  const [error, setError] = useState('');
  const [showGeneratedAccessCode, setShowGeneratedAccessCode] = useState(false);
  const [generatedAccessCode, setGeneratedAccessCode] = useState('');
  const [copied, setCopied] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$5',
      messages: '10 messages',
      description: 'Perfect for regular users',
      features: ['10 messages total', 'Mental health support', 'Anonymous chat'],
      icon: Shield,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$15',
      messages: '20 messages',
      description: 'For heavy users',
      features: ['20 messages', 'Priority support', 'Advanced features'],
      icon: Zap,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError('');

    try {
      const subscription = await sessionChatService.createSubscription(selectedPlan);
      await sessionChatService.linkSessionToSubscription(subscription.subscription_token);
      
      // Show the access code to the user
      setGeneratedAccessCode(subscription.access_code);
      setShowGeneratedAccessCode(true);
      
      // Call success callback immediately but don't close modal
      onSubscriptionSuccess(subscription);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessCodeSubmit = async () => {
    if (!accessCode.trim()) {
      setError('Please enter an access code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await sessionChatService.validateAccessCode(accessCode);
      
      if (response.success && response.subscription_token) {
        await sessionChatService.linkSessionToSubscription(response.subscription_token);
        
        onSubscriptionSuccess({
          subscription_token: response.subscription_token,
          access_code: accessCode,
          plan_type: response.plan_type || 'basic',
          message_limit: response.message_limit || null,
          price: response.plan_type === 'premium' ? 15 : 5
        });
        
        onClose();
      } else {
        setError(response.message || 'Invalid access code');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to validate access code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAccessCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedAccessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy access code:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Upgrade Plan</h2>
            <p className="text-blue-100 text-sm">
              {messagesUsed}/{messageLimit || '∞'} messages used
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Generated Access Code Display */}
          {showGeneratedAccessCode && (
            <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Success!</h3>
                <p className="text-green-700 mb-4 text-sm">Your access code is ready</p>
                
                <div className="bg-white border-2 border-green-300 rounded-xl p-4 mb-4 relative">
                  <code className="text-xl font-mono font-bold text-green-800 block">{generatedAccessCode}</code>
                  <button
                    onClick={handleCopyAccessCode}
                    className="absolute top-2 right-2 p-2 hover:bg-green-50 rounded-lg transition-colors group"
                    title="Copy access code"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-green-600 group-hover:text-green-700" />
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-green-600 mb-4">Save this code to use on other devices</p>
                <button
                  onClick={onClose}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Continue to Chat
                </button>
              </div>
            </div>
          )}

          {!showAccessCodeInput ? (
            <>
              {/* Plan Selection */}
              <div className="space-y-3 mb-6">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan === plan.id;
                  
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id as 'basic' | 'premium')}
                      className={`relative p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-primary-start bg-gradient-to-br from-primary-start/20 to-primary-end/15 shadow-md'
                          : 'border-primary-start/30 hover:border-primary-start/50 bg-gradient-to-br from-primary-start/10 to-primary-end/5 hover:shadow-sm'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-primary-start rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900">{plan.price}</div>
                              <div className="text-xs text-gray-500">{plan.messages}</div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                          
                          <div className="flex flex-wrap gap-1">
                            {plan.features.slice(0, 2).map((feature, index) => (
                              <span key={index} className="text-xs bg-primary-start/20 text-gray-700 px-2 py-1 rounded-md">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
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
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                >
                  I Have an Access Code
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Access Code Input */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Access Code</h3>
                <p className="text-gray-600 text-sm">
                  Already have a subscription? Enter your code below.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    placeholder="e.g., BASIC-ABC123"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-mono text-lg"
                    maxLength={20}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAccessCodeSubmit}
                    disabled={isLoading || !accessCode.trim()}
                    className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      'Validate Code'
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowAccessCodeInput(false)}
                    className="px-6 py-4 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Back
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
