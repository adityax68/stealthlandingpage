export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface GoogleOAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: any;
  is_new_user: boolean;
}

// Extend Window interface for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          disableAutoSelect: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

class GoogleOAuthService {
  private static instance: GoogleOAuthService;
  private clientId: string;
  private isInitialized = false;

  private constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  }

  public static getInstance(): GoogleOAuthService {
    if (!GoogleOAuthService.instance) {
      GoogleOAuthService.instance = new GoogleOAuthService();
    }
    return GoogleOAuthService.instance;
  }

  /**
   * Initialize Google OAuth and get the ID token
   */
  public async signInWithGoogle(): Promise<string> {
    try {
      // Load the Google Identity Services script
      await this.loadGoogleScript();
      
      // Initialize the Google Identity Services
      return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.google) {
            window.google.accounts.id.initialize({
              client_id: this.clientId,
              callback: (response: any) => {
                if (response.credential) {
                  resolve(response.credential);
                } else {
                  reject(new Error('No credential received from Google'));
                }
              },
              auto_select: false,
              cancel_on_tap_outside: true,
              use_fedcm_for_prompt: false, // Disable FedCM to avoid CORS issues
              itp_support: true, // Enable ITP support
              context: 'signin', // Set context for better popup handling
              ux_mode: 'popup', // Use popup mode for better CORS handling
            });

          this.isInitialized = true;

          // Use the prompt method directly for better popup handling
          window.google.accounts.id.prompt((notification: any) => {
            console.log('Google prompt notification:', notification);
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              reject(new Error('Google Sign-In was not displayed or was skipped'));
            }
          });
        } else {
          reject(new Error('Google Identity Services not loaded'));
        }
      });
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }

  /**
   * Load the Google Identity Services script
   */
  private async loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window object not available'));
        return;
      }

      // Check if script is already loaded
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Sign out from Google
   */
  public async signOut(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.google && this.isInitialized) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      console.error('Google Sign-Out error:', error);
    }
  }

  /**
   * Get the Google Client ID
   */
  public getClientId(): string {
    return this.clientId;
  }

  /**
   * Check if Google OAuth is properly configured
   */
  public isConfigured(): boolean {
    return !!this.clientId;
  }
}

export default GoogleOAuthService;
