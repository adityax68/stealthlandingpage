import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: string;
  privileges: string[];
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUserRole: (newRole: string) => void;
  hasPrivilege: (privilege: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing user data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUserRole = (newRole: string) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      // Also update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const hasPrivilege = (privilege: string): boolean => {
    return user?.privileges.includes(privilege) || false;
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserRole, hasPrivilege, hasRole }}>
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