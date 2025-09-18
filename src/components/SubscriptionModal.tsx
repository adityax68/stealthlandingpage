import React, { useState } from 'react';
import { X, CreditCard, Shield, Zap, CheckCircle } from 'lucide-react';
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
  currentPlan = 'free',
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
      messages: 'Unlimited',
      description: 'For heavy users',
      features: ['Unlimited messages', 'Priority support', 'Advanced features'],
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
            <p className="text-gray-600 mt-1">
              You've used {messagesUsed}/{messageLimit || '∞'} messages. Choose a plan to continue chatting.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Generated Access Code Display */}
          {showGeneratedAccessCode && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Subscription Successful!</h3>
                <p className="text-green-700 mb-3">Your access code is:</p>
                <div className="bg-white border-2 border-green-300 rounded-lg p-3 mb-3">
                  <code className="text-2xl font-mono font-bold text-green-800">{generatedAccessCode}</code>
                </div>
                <p className="text-sm text-green-600 mb-4">Please save this code! You can use it to activate your plan on other devices.</p>
                <button
                  onClick={onClose}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Continue to Chat
                </button>
              </div>
            </div>
          )}

          {!showAccessCodeInput ? (
            <>
              {/* Plan Selection */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan === plan.id;
                  
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id as 'basic' | 'premium')}
                      className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                      
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      
                      <div className="text-3xl font-bold text-gray-900 mb-2">{plan.price}</div>
                      <div className="text-sm text-gray-500 mb-4">{plan.messages}</div>
                      
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
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
                <p className="text-gray-600">
                  If you already have a subscription, enter your access code to continue.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Code
                  </label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    placeholder="e.g., BASIC-ABC123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={20}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAccessCodeSubmit}
                    disabled={isLoading || !accessCode.trim()}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      'Validate Code'
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowAccessCodeInput(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back to Plans
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Current Usage Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Current Usage</h4>
            <div className="text-sm text-gray-600">
              <div>Plan: <span className="font-medium capitalize">{currentPlan}</span></div>
              <div>Messages: <span className="font-medium">{messagesUsed}/{messageLimit || '∞'}</span></div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
