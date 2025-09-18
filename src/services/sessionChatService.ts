import { API_ENDPOINTS } from '../config/api';

export interface SessionChatMessage {
  message: string;
  session_identifier: string;
}

export interface SessionChatResponse {
  message: string;
  conversation_id: string;
  requires_subscription: boolean;
  messages_used: number;
  message_limit: number | null;
  plan_type: string;
}

export interface SubscriptionResponse {
  subscription_token: string;
  access_code: string;
  plan_type: string;
  message_limit: number | null;
  price: number;
  expires_at?: string;
}

export interface AccessCodeRequest {
  access_code: string;
}

export interface AccessCodeResponse {
  success: boolean;
  message: string;
  subscription_token?: string;
  plan_type?: string;
  message_limit?: number | null;
}

export interface SessionMessage {
  id: number;
  role: string;
  content: string;
  created_at: string;
}

export interface SessionConversation {
  session_identifier: string;
  title: string;
  created_at: string;
  messages: SessionMessage[];
  usage_info: {
    can_send: boolean;
    messages_used: number;
    message_limit: number | null;
    plan_type: string;
    error?: string;
  };
}

class SessionChatService {
  private sessionId: string | null = null;

  constructor() {
    this.initializeSession();
  }

  private initializeSession(): void {
    // Check if session already exists in localStorage
    this.sessionId = localStorage.getItem('sessionId');
    
    if (!this.sessionId) {
      // Generate new session ID
      this.sessionId = this.generateSessionId();
      localStorage.setItem('sessionId', this.sessionId);
    }
  }

  private generateSessionId(): string {
    return `sess_${Math.random().toString(36).substr(2, 12)}`;
  }

  getSessionId(): string {
    if (!this.sessionId) {
      this.initializeSession();
    }
    return this.sessionId!;
  }

  async sendMessage(message: string): Promise<SessionChatResponse> {
    try {
      const sessionId = this.getSessionId();
      console.log('Sending message with session ID:', sessionId);
      console.log('Message content:', message);
      
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/v1/session-chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_identifier: sessionId
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Message sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async createSubscription(planType: 'free' | 'basic' | 'premium'): Promise<SubscriptionResponse> {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/v1/session-chat/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_type: planType
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async validateAccessCode(accessCode: string): Promise<AccessCodeResponse> {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/v1/session-chat/access-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_code: accessCode
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async linkSessionToSubscription(subscriptionToken: string): Promise<void> {
    const params = new URLSearchParams({
      session_identifier: this.getSessionId(),
      subscription_token: subscriptionToken
    });
    
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/v1/session-chat/link-session?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async getConversation(): Promise<SessionConversation> {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/v1/session-chat/conversation/${this.getSessionId()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getUsageInfo(): Promise<any> {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/v1/session-chat/usage/${this.getSessionId()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async deleteConversation(): Promise<void> {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/v1/session-chat/conversation/${this.getSessionId()}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Clear session and create new one
    localStorage.removeItem('sessionId');
    this.initializeSession();
  }

  // Helper method to check if user needs subscription
  needsSubscription(response: SessionChatResponse): boolean {
    return response.requires_subscription;
  }

  // Helper method to get remaining messages
  getRemainingMessages(response: SessionChatResponse): number {
    if (response.message_limit === null) {
      return Infinity; // Unlimited
    }
    return Math.max(0, response.message_limit - response.messages_used);
  }

  // Helper method to format usage info
  formatUsageInfo(response: SessionChatResponse): string {
    if (response.message_limit === null) {
      return `Unlimited messages (${response.messages_used} used)`;
    }
    return `${response.messages_used}/${response.message_limit} messages used`;
  }
}

export const sessionChatService = new SessionChatService();
