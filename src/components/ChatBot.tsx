import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Paperclip } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { useMood } from '../contexts/MoodContext';
import { useToast } from '../contexts/ToastContext';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatBotProps {
  isAuthenticated: boolean;
}

const ChatBot: React.FC<ChatBotProps> = ({ isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const [attachments, setAttachments] = useState<Array<{id: number, filename: string, isProcessed: boolean}>>([]);
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [hasInitializedWithMood, setHasInitializedWithMood] = useState(false);
  const { showToast } = useToast();
  
  const { moodData, clearMoodData } = useMood();
  
  // Function to start a new chat
  const handleNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setError(null);
    setIsNewChat(true);
    setAttachments([]);
    setIsProcessingDocument(false);
    setHasInitializedWithMood(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Focus the input for immediate typing
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Ensure messages container is scrollable
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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

  // Handle mood data initialization - CONSOLIDATED useEffect
  useEffect(() => {
    if (isAuthenticated && moodData && !hasInitializedWithMood) {
      // Open chat and initialize with mood data
      setIsOpen(true);
      setHasInitializedWithMood(true);
      
      // Create mood context message (not shown to user)
      const moodContext = `I'm feeling ${moodData.mood}${moodData.reason ? ` because ${moodData.reason}` : ''}`;
      
      // Send the mood context directly to AI without showing user message
      sendMoodMessage(moodContext).catch(error => {
        console.error('Failed to send mood message:', error);
        // Don't clear mood data if sending failed
      });
      
      // Clear mood data after use
      clearMoodData();
    }
  }, [isAuthenticated, moodData, hasInitializedWithMood, clearMoodData]);


  const sendMoodMessage = async (moodMessage: string) => {
    setIsLoading(true);
    setError(null);
    setIsNewChat(false);

    try {
      const token = localStorage.getItem('access_token');
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
          message: moodMessage,
          conversation_id: currentConversationId,
          attachment_ids: []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: data.message_id,
        role: 'assistant',
        content: data.assistant_message,
        created_at: new Date().toISOString()
      };

      // Only add assistant message, no user message if hideUserMessage is true
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentConversationId(data.conversation_id);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
      setIsNewChat(false);

    try {
      // Debug: Check token
      const token = localStorage.getItem('access_token');
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
          conversation_id: currentConversationId,
          attachment_ids: attachments.map(att => att.id)
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
      
      // Clear attachments after successful send
      setAttachments([]);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleRemoveFile = (attachmentId: number) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      uploadFile(file);
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const uploadFile = async (file: File) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp'
    ];

    // Check if file is already uploaded
    const isAlreadyUploaded = attachments.some(att => att.filename === file.name);
    if (isAlreadyUploaded) {
      setError(`File "${file.name}" is already uploaded`);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 10MB limit`);
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`File type not supported. Allowed: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, WebP, BMP`);
      return;
    }

    setIsProcessingDocument(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API_ENDPOINTS.CHAT_UPLOAD, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const uploadedFileData = await response.json();
      setAttachments(prev => [...prev, {
        id: uploadedFileData.file_id,
        filename: uploadedFileData.filename,
        isProcessed: true
      }]);
      setIsProcessingDocument(false);
      
      // Show success message
      setError(null); // Clear any previous errors

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      setIsProcessingDocument(false);
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
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110">
          <Send size={20} />
        </div>
      </div>

      {/* Chat Modal - Simplified without history */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header - Fixed */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 flex items-center justify-between flex-shrink-0 z-10">
            <div className="flex items-center space-x-3">
              <Send size={18} />
              <span className="font-light text-lg tracking-wide">Acutie</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* New Chat Button - Only show when there are messages */}
              {messages.length > 0 && (
                <button
                  onClick={handleNewChat}
                  className="text-white hover:text-cyan-200 transition-colors p-2 rounded-lg border border-white/20 hover:bg-white/10 text-xs font-medium"
                  title="Start a new conversation"
                >
                  New Chat
                </button>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Reset to clean state when closing
                  setTimeout(() => {
                    setMessages([]);
                    setCurrentConversationId(null);
                    setError(null);
                    setIsNewChat(false);
                    setAttachments([]);
                    setIsProcessingDocument(false);
                    // Reset file input
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }, 300); // Small delay to allow modal close animation
                }}
                className="text-white hover:text-cyan-200 transition-colors p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Area - Main Content */}
          <div className="flex-1 flex flex-col bg-white min-h-0">
            {/* Messages Container - Scrollable */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              style={{ maxHeight: 'calc(500px - 140px)' }}
            >
              {messages.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 py-12">
                  <Send size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 font-light mb-2 text-sm tracking-wide">
                    {isNewChat ? 'New conversation started' : 'Start a conversation with Acutie'}
                  </p>
                  <p className="text-xs text-gray-400 font-light">I'm here to listen, provide emotional support, and offer guidance if needed</p>
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
                        ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white'
                        : 'bg-white text-gray-800 border border-gray-200/60'
                    }`}
                  >
                    <p className="text-sm leading-relaxed font-light">{msg.content}</p>
                    <p className={`text-xs mt-2 font-light ${
                      msg.role === 'user' ? 'text-slate-300' : 'text-gray-400'
                    }`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && !isProcessingDocument && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 z-10">
              {/* Document List */}
              {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 text-sm">
                      <Paperclip size={14} className="text-gray-600" />
                      <span className="text-gray-700 truncate max-w-32">{attachment.filename}</span>
                      <button
                        onClick={() => handleRemoveFile(attachment.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-end space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 relative"
                  title={isProcessingDocument ? "Uploading..." : "Attach file"}
                >
                  {isProcessingDocument ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-cyan-500 rounded-full animate-spin"></div>
                  ) : (
                    <Paperclip size={20} />
                  )}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.bmp"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={isLoading}
                />
                
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message to Acutie..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none min-h-[50px] max-h-32"
                    disabled={isLoading}
                    rows={1}
                    style={{ minHeight: '50px' }}
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={(!message.trim() && attachments.length === 0) || isLoading}
                  className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-full transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 