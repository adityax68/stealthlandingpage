import { API_ENDPOINTS } from '../config/api';
import GoogleOAuthService from './GoogleOAuthService';

export interface User {
  id: number;
  email: string;
  username?: string;  // Optional for Google OAuth users
  full_name?: string;  // Optional for Google OAuth users
  role: string;
  privileges: string[];
  is_active: boolean;
  age?: number;  // Optional for Google OAuth users
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  google_id?: string;  // NEW: Google OAuth fields
  auth_provider: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  user?: User;
  verification_required?: boolean;
  can_resend_verification?: boolean;
}

export interface GoogleOAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
  is_new_user: boolean;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TokenStatusResponse {
  is_valid: boolean;
  expires_at?: string;
  user_id?: number;
}

class AuthService {
  private static instance: AuthService;
  private refreshPromise: Promise<string> | null = null;
  private isRefreshing = false;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Token management
  public getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  public getUser(): User | null {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearTokens();
        return null;
      }
    }
    return null;
  }

  public setTokens(accessToken: string, refreshToken: string, user: User): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }

  public clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Token validation
  public isTokenValid(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  public isTokenExpiringSoon(thresholdMinutes: number = 5): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const thresholdTime = currentTime + (thresholdMinutes * 60);
      return payload.exp <= thresholdTime;
    } catch (error) {
      return true;
    }
  }

  public getTokenExpiryTime(): Date | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  // Authentication methods
  public async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      // If it's a verification error, return the response data instead of throwing
      if (data.verification_required) {
        return data;
      }
      throw new Error(data.message || 'Login failed');
    }

    // If successful, set tokens and return the response
    if (data.access_token && data.refresh_token && data.user) {
      this.setTokens(data.access_token, data.refresh_token, data.user);
    }
    return data;
  }

  // NEW: Google OAuth login
  public async loginWithGoogle(): Promise<GoogleOAuthResponse> {
    try {
      const googleService = GoogleOAuthService.getInstance();
      
      if (!googleService.isConfigured()) {
        throw new Error('Google OAuth is not configured');
      }

      // Get Google ID token
      const googleToken = await googleService.signInWithGoogle();
      
      // Send token to backend
      const response = await fetch(API_ENDPOINTS.GOOGLE_OAUTH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ google_token: googleToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Google login failed');
      }

      const data: GoogleOAuthResponse = await response.json();
      this.setTokens(data.access_token, data.refresh_token, data.user);
      return data;
    } catch (error) {
      console.error('Google OAuth login error:', error);
      throw error;
    }
  }

  public async refreshToken(): Promise<string> {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(API_ENDPOINTS.REFRESH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Token refresh failed');
      }

      const data: RefreshTokenResponse = await response.json();
      
      // Update stored tokens
      const user = this.getUser();
      if (user) {
        this.setTokens(data.access_token, data.refresh_token, user);
      }

      return data.access_token;
    } catch (error) {
      // If refresh fails, clear all tokens
      this.clearTokens();
      throw error;
    }
  }

  public async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      try {
        await fetch(API_ENDPOINTS.REVOKE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        console.error('Error revoking token:', error);
      }
    }

    this.clearTokens();
  }

  public async revokeAllTokens(): Promise<void> {
    const accessToken = this.getAccessToken();
    
    if (accessToken) {
      try {
        await fetch(API_ENDPOINTS.REVOKE_ALL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error revoking all tokens:', error);
      }
    }

    this.clearTokens();
  }

  public async checkTokenStatus(): Promise<TokenStatusResponse> {
    const accessToken = this.getAccessToken();
    
    if (!accessToken) {
      return { is_valid: false };
    }

    try {
      const response = await fetch(API_ENDPOINTS.TOKEN_STATUS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        return { is_valid: false };
      }

      return await response.json();
    } catch (error) {
      return { is_valid: false };
    }
  }

  // Automatic token refresh
  public async ensureValidToken(): Promise<string | null> {
    if (this.isTokenValid()) {
      return this.getAccessToken();
    }

    if (this.isTokenExpiringSoon()) {
      try {
        return await this.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
      }
    }

    return null;
  }

  // Session management
  public getSessionInfo(): {
    isAuthenticated: boolean;
    user: User | null;
    tokenExpiry: Date | null;
    isExpiringSoon: boolean;
  } {
    const user = this.getUser();
    const tokenExpiry = this.getTokenExpiryTime();
    const isExpiringSoon = this.isTokenExpiringSoon();

    return {
      isAuthenticated: !!user && this.isTokenValid(),
      user,
      tokenExpiry,
      isExpiringSoon,
    };
  }
}

export default AuthService;
