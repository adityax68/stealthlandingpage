import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Trash2, Plus } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatBotProps {
  isAuthenticated: boolean;
}

const ChatBot: React.FC<ChatBotProps> = ({ isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: message.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Debug: Check token
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      console.log('Token length:', token ? token.length : 0);
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(API_ENDPOINTS.CHAT_SEND, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_id: currentConversationId
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.detail || errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: data.message_id,
        role: 'assistant',
        content: data.assistant_message,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentConversationId(data.conversation_id);
      
      // Refresh conversations list
      loadConversations();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Loading conversations with token:', token ? token.substring(0, 20) + '...' : 'No token');
      
      if (!token) {
        console.error('No token available for loading conversations');
        return;
      }

      const response = await fetch(API_ENDPOINTS.CHAT_CONVERSATIONS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Conversations response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to load conversations:', errorData);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const loadConversationMessages = async (conversationId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.CHAT_MESSAGES}/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setCurrentConversationId(conversationId);
        setIsOpen(true);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setError(null);
    setIsOpen(true);
    setShowSidebar(false); // Hide sidebar for new conversations
  };

  const deleteConversation = async (conversationId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.CHAT_MESSAGES}/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        if (currentConversationId === conversationId) {
          setMessages([]);
          setCurrentConversationId(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Floating Chat Icon */}
      <div 
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110">
          <MessageCircle size={24} />
        </div>
      </div>

      {/* Chat Modal - Enterprise Level */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[500px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header - Fixed */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <div className="w-5 h-1 bg-white mb-1"></div>
                <div className="w-5 h-1 bg-white mb-1"></div>
                <div className="w-5 h-1 bg-white"></div>
              </button>
              <MessageCircle size={20} />
              <span className="font-semibold text-lg">Acutie</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-purple-200 transition-colors p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
              {/* Conversations Sidebar - Collapsible */}
              {showSidebar && (
                <div className="w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
                  <div className="p-3 border-b border-gray-200 bg-white">
                    <button
                      onClick={startNewConversation}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>New Chat</span>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-100 ${
                          currentConversationId === conv.id ? 'bg-purple-50 border-r-2 border-purple-500' : ''
                        }`}
                        onClick={() => loadConversationMessages(conv.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conv.title || 'New Chat'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(conv.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conv.id);
                            }}
                            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Area - Main Content */}
              <div className="flex-1 flex flex-col bg-white">
                {/* Messages Container - Scrollable */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                >
                  {messages.length === 0 && !isLoading && (
                    <div className="text-center text-gray-500 py-12">
                      <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600 font-medium mb-2">Start a conversation with Acutie</p>
                      <p className="text-sm text-gray-500">I'm here to listen, provide emotional support, and offer guidance if needed</p>
                    </div>
                  )}
                  
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-2 ${
                          msg.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Error Display */}
                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm mx-4 mb-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* Input Area - Fixed at Bottom */}
                <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                  <div className="flex space-x-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message to Acutie..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isLoading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl transition-all duration-200 font-medium disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 