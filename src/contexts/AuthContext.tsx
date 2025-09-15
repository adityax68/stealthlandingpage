import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService, { type User } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (newRole: string) => void;
  hasPrivilege: (privilege: string) => boolean;
  hasRole: (role: string) => boolean;
  refreshToken: () => Promise<void>;
  checkSessionStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const authService = AuthService.getInstance();

  useEffect(() => {
    // Initialize auth state from localStorage
    const sessionInfo = authService.getSessionInfo();
    setUser(sessionInfo.user);
    setIsAuthenticated(sessionInfo.isAuthenticated);

    // Set up periodic session check
    const interval = setInterval(() => {
      const currentSession = authService.getSessionInfo();
      setUser(currentSession.user);
      setIsAuthenticated(currentSession.isAuthenticated);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const tokenResponse = await authService.login(email, password);
      setUser(tokenResponse.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await authService.refreshToken();
      const sessionInfo = authService.getSessionInfo();
      setUser(sessionInfo.user);
      setIsAuthenticated(sessionInfo.isAuthenticated);
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateUserRole = (newRole: string) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      // Update in AuthService
      const currentUser = authService.getUser();
      if (currentUser) {
        authService.setTokens(
          authService.getAccessToken() || '',
          authService.getRefreshToken() || '',
          updatedUser
        );
      }
    }
  };

  const hasPrivilege = (privilege: string): boolean => {
    return user?.privileges.includes(privilege) || false;
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const checkSessionStatus = () => {
    const sessionInfo = authService.getSessionInfo();
    setUser(sessionInfo.user);
    setIsAuthenticated(sessionInfo.isAuthenticated);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isRefreshing,
      login, 
      logout, 
      updateUserRole, 
      hasPrivilege, 
      hasRole,
      refreshToken,
      checkSessionStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 