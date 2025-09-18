import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, AlertCircle, Trash2 } from 'lucide-react';
import { sessionChatService } from '../services/sessionChatService';
import type { SessionChatResponse, SubscriptionResponse } from '../services/sessionChatService';
import SubscriptionModal from './SubscriptionModal';

interface SessionChatBotProps {
  isAuthenticated?: boolean;
  moodData?: { mood: string; reason: string } | null;
  onMoodDataClear?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SessionChatBot: React.FC<SessionChatBotProps> = ({ 
  moodData, 
  onMoodDataClear 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [usageInfo, setUsageInfo] = useState({
    messages_used: 0,
    message_limit: null as number | null,
    plan_type: 'loading',
    can_send: false
  });
  const [hasInitializedWithMood, setHasInitializedWithMood] = useState(false);
  const [showAccessCodeInput, setShowAccessCodeInput] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);
  const [isValidatingAccessCode, setIsValidatingAccessCode] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [accessCodeError, setAccessCodeError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  // Handle mood data initialization
  useEffect(() => {
    if (moodData && !hasInitializedWithMood) {
      setIsOpen(true);
      setHasInitializedWithMood(true);
      
      const moodContext = `I'm feeling ${moodData.mood}${moodData.reason ? ` because ${moodData.reason}` : ''}`;
      
      // Send mood message and clear data after it's sent
      sendMoodMessage(moodContext).then(() => {
        if (onMoodDataClear) {
          onMoodDataClear();
        }
      }).catch((error) => {
        console.error('Failed to send mood message:', error);
        // Still clear the data even if sending fails
        if (onMoodDataClear) {
          onMoodDataClear();
        }
      });
    }
  }, [moodData, hasInitializedWithMood, onMoodDataClear]);

  const sendMoodMessage = async (moodMessage: string) => {
    try {
      setIsLoading(true);
      const response = await sessionChatService.sendMessage(moodMessage);
      
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: moodMessage,
        timestamp: new Date()
      };
      
      // Add AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage, aiMessage]);
      updateUsageInfo(response);
      
    } catch (error) {
      console.error('Failed to send mood message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !usageInfo.can_send || getRemainingMessages() <= 0) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    // Add user message immediately
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sessionChatService.sendMessage(messageText);
      
      // Add AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      updateUsageInfo(response);

      // Check if subscription is needed
      if (response.requires_subscription) {
        setShowSubscriptionModal(true);
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Get more specific error message
      let errorText = 'Sorry, I encountered an error. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorText = 'Request timed out. Please check your connection and try again.';
        } else if (error.message.includes('Network error')) {
          errorText = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('Failed to process chat message')) {
          errorText = 'Server error. Please try again in a moment.';
        } else {
          errorText = `Error: ${error.message}`;
        }
      }
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUsageInfo = (response: SessionChatResponse) => {
    setUsageInfo({
      messages_used: response.messages_used,
      message_limit: response.message_limit || 0,
      plan_type: response.plan_type,
      can_send: !response.requires_subscription
    });
    
    // Update current plan for badge display
    setCurrentPlan(response.plan_type);
  };

  const handleSubscriptionSuccess = async (subscription: SubscriptionResponse) => {
    // Refresh usage info from backend to get accurate data
    try {
      const usageInfo = await sessionChatService.getUsageInfo();
      setUsageInfo({
        messages_used: usageInfo.messages_used,
        message_limit: usageInfo.message_limit,
        plan_type: usageInfo.plan_type,
        can_send: usageInfo.can_send
      });
      
      // Reload conversation history for the new plan
      await loadConversation();
    } catch (error) {
      console.error('Failed to refresh usage info:', error);
      // Fallback to subscription data
      setUsageInfo(prev => ({
        ...prev,
        plan_type: subscription.plan_type,
        message_limit: subscription.message_limit || 0,
        can_send: true
      }));
    }
    // Don't close modal automatically - let user close it manually after seeing access code
  };

  // Clear input when limit is reached (only when data is loaded)
  useEffect(() => {
    if (!isLoadingUsage && !usageInfo.can_send) {
      setInputMessage('');
    }
  }, [usageInfo.can_send, isLoadingUsage]);

  const handleAccessCodeSubmit = async () => {
    if (!accessCode.trim()) return;
    
    try {
      setIsValidatingAccessCode(true);
      setAccessCodeError(null);
      
      const response = await sessionChatService.validateAccessCode(accessCode);
      if (response.success && response.subscription_token) {
        await sessionChatService.linkSessionToSubscription(response.subscription_token);
        
        // Refresh usage info
        const usageInfo = await sessionChatService.getUsageInfo();
        setUsageInfo({
          messages_used: usageInfo.messages_used,
          message_limit: usageInfo.message_limit,
          plan_type: usageInfo.plan_type,
          can_send: usageInfo.can_send
        });
        
        // Set current plan for badge display
        setCurrentPlan(usageInfo.plan_type);
        
        // Reload conversation history for the new plan
        await loadConversation();
        
        setShowAccessCodeInput(false);
        setAccessCode('');
        setAccessCodeError(null);
      } else {
        setAccessCodeError('Invalid access code');
      }
    } catch (error) {
      console.error('Failed to validate access code:', error);
      setAccessCodeError('Invalid access code');
    } finally {
      setIsValidatingAccessCode(false);
    }
  };

  const loadConversation = async () => {
    try {
      setIsLoadingUsage(true);
      const conversation = await sessionChatService.getConversation();
      
      const conversationMessages: Message[] = conversation.messages.map(msg => ({
        id: `msg-${msg.id}`,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }));
      
      setMessages(conversationMessages);
      setUsageInfo({
        messages_used: conversation.usage_info.messages_used,
        message_limit: conversation.usage_info.message_limit,
        plan_type: conversation.usage_info.plan_type,
        can_send: conversation.usage_info.can_send
      });
      
      // Set current plan for badge display
      setCurrentPlan(conversation.usage_info.plan_type);
      
    } catch (error) {
      console.error('Failed to load conversation:', error);
      
      // Set fallback state based on error type
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isTimeout = errorMessage.includes('timeout');
      
      setUsageInfo({
        messages_used: 0,
        message_limit: isTimeout ? 5 : null, // Fallback to free plan for timeout
        plan_type: isTimeout ? 'free' : 'error',
        can_send: isTimeout // Allow sending if it's just a timeout
      });
      
      // Show user-friendly error message
      if (!isTimeout) {
        const errorMsg: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I had trouble loading your conversation. Please try refreshing the page.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsLoadingUsage(false);
    }
  };

  const clearConversation = async () => {
    try {
      await sessionChatService.deleteConversation();
      setMessages([]);
      
      // Keep everything exactly the same - only clear the conversation history
      // Don't change subscription, plan, or remaining messages at all
      // DO NOT refresh usage info - it should remain unchanged
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  };

  // Load conversation when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadConversation();
    }
  }, [isOpen]);

  // Add retry mechanism for failed loads
  const retryLoadConversation = () => {
    if (!isLoadingUsage) {
      loadConversation();
    }
  };

  const getRemainingMessages = () => {
    if (usageInfo.message_limit === null) return Infinity; // Use Infinity for unlimited
    return Math.max(0, usageInfo.message_limit - usageInfo.messages_used);
  };

  const getRemainingMessagesText = () => {
    if (usageInfo.message_limit === null) return 'Unlimited';
    return Math.max(0, usageInfo.message_limit - usageInfo.messages_used).toString();
  };

  const getUsageColor = () => {
    const remaining = getRemainingMessages();
    if (remaining === Infinity) return 'text-green-600';
    if (remaining <= 1) return 'text-red-600';
    if (remaining <= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getPlanBadge = (planType: string) => {
    const badges = {
      free: { text: 'FREE', color: 'bg-gray-500 text-white' },
      basic: { text: 'BASIC', color: 'bg-blue-500 text-white' },
      premium: { text: 'PREMIUM', color: 'bg-purple-500 text-white' }
    };
    return badges[planType as keyof typeof badges] || { text: 'FREE', color: 'bg-gray-500 text-white' };
  };

  const isInputDisabled = () => {
    // Disable if loading, can't send, or no messages left
    return isLoading || !usageInfo.can_send || isLoadingUsage || getRemainingMessages() <= 0;
  };

  const handleUpgradeClick = () => {
    setShowAccessCodeInput(true);
    setAccessCode('');
    setAccessCodeError(null);
  };

  const handleCancelUpgrade = () => {
    setShowAccessCodeInput(false);
    setAccessCode('');
    setAccessCodeError(null);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[500px] h-[650px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
            {/* Main Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-semibold">Acutie</h3>
                  <div className="text-xs opacity-90">
                    {isLoadingUsage ? (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <span className="ml-1">Loading...</span>
                      </div>
                    ) : usageInfo.plan_type === 'error' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-300">Error loading plan</span>
                        <button
                          onClick={retryLoadConversation}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    ) : usageInfo.plan_type === 'free' ? (
                      <span className={getUsageColor()}>
                        {getRemainingMessagesText()} messages left
                      </span>
                    ) : usageInfo.plan_type === 'basic' ? (
                      <span className={getUsageColor()}>
                        {getRemainingMessagesText()} messages left
                      </span>
                    ) : usageInfo.plan_type === 'premium' ? (
                      <span className="text-green-300">Unlimited messages</span>
                    ) : null}
                  </div>
                </div>
                {/* Plan Badge */}
                {currentPlan && (
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadge(currentPlan).color}`}>
                    {getPlanBadge(currentPlan).text}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Upgrade Button */}
                {!showAccessCodeInput && (
                  <button
                    onClick={handleUpgradeClick}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg transition-colors"
                    title="Upgrade plan"
                  >
                    Upgrade
                  </button>
                )}
                {/* Subscription Modal Button */}
                {!showAccessCodeInput && (
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="px-3 py-1 bg-green-600/80 hover:bg-green-600 text-white text-xs rounded-lg transition-colors"
                    title="View subscription plans"
                  >
                    Plans
                  </button>
                )}
                <button
                  onClick={clearConversation}
                  className="p-1 hover:bg-blue-700 rounded transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-blue-700 rounded transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Access Code Input */}
            {showAccessCodeInput && (
              <div className="px-4 pb-4 border-t border-blue-500">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => {
                        setAccessCode(e.target.value);
                        setAccessCodeError(null); // Clear error when typing
                      }}
                      placeholder="Enter access code..."
                      className={`flex-1 px-3 py-2 text-sm bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                        accessCodeError 
                          ? 'border-red-400 focus:border-red-400' 
                          : 'border-white/30 focus:border-white/50'
                      }`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAccessCodeSubmit();
                        }
                      }}
                    />
                    <button
                      onClick={handleAccessCodeSubmit}
                      disabled={!accessCode.trim() || isValidatingAccessCode}
                      className="px-3 py-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {isValidatingAccessCode ? '...' : 'Apply'}
                    </button>
                    <button
                      onClick={handleCancelUpgrade}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Error Message */}
                  {accessCodeError && (
                    <div className="text-red-300 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {accessCodeError}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Start a conversation with Acutie</p>
                <p className="text-sm">Your mental health companion is here to help</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-2 py-1 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-2 py-1 rounded-2xl">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600 mr-2">Acutie is typing</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            {!isLoadingUsage && !usageInfo.can_send && (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      You've reached your message limit. Subscribe to continue.
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAccessCodeInput(true)}
                      className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      Enter Access Code
                    </button>
                    <button
                      onClick={() => setShowSubscriptionModal(true)}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Loading Usage Info */}
            {isLoadingUsage && (
              <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex space-x-1 mr-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    Loading your subscription details...
                  </span>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex space-x-1 mr-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-blue-800">
                    Acutie is typing your response...
                  </span>
                </div>
              </div>
            )}
            
            {/* Access Code Input */}
            {!isLoadingUsage && showAccessCodeInput && (
              <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAccessCodeSubmit()}
                    placeholder="Enter your access code..."
                    className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                  <button
                    onClick={handleAccessCodeSubmit}
                    disabled={!accessCode.trim()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => setShowAccessCodeInput(false)}
                    className="text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                  value={inputMessage}
                  onChange={(e) => {
                    if (!isInputDisabled()) {
                      setInputMessage(e.target.value);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isInputDisabled()) {
                      sendMessage();
                    }
                  }}
                placeholder={
                  isLoading 
                    ? "Acutie is typing..." 
                    : isLoadingUsage
                      ? "Loading your plan..."
                        : !usageInfo.can_send 
                          ? "Subscribe to continue chatting..." 
                         : getRemainingMessages() <= 0
                           ? "No messages left - upgrade to continue..."
                           : "Type your message..."
                }
                disabled={isInputDisabled()}
                className={`flex-1 px-4 py-3 border-2 rounded-lg focus:ring-2 focus:border-blue-500 disabled:cursor-not-allowed text-gray-900 bg-white text-base font-medium ${
                  !isLoadingUsage && (!usageInfo.can_send || getRemainingMessages() <= 0)
                    ? 'border-red-300 bg-red-50 placeholder-red-400' 
                    : 'border-gray-300 placeholder-gray-500 focus:ring-blue-500'
                } ${isLoading || isLoadingUsage ? 'opacity-50' : ''}`}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isInputDisabled()}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscriptionSuccess={handleSubscriptionSuccess}
        currentPlan={usageInfo.plan_type}
        messagesUsed={usageInfo.messages_used}
        messageLimit={usageInfo.message_limit}
      />
    </>
  );
};

export default SessionChatBot;
