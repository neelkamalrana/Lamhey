import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, isAuthenticated, signOut as cognitoSignOut } from '../config/cognito';

interface User {
  attributes: {
    name: string;
    email: string;
  };
  username: string;
  authCode?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    try {
      if (isAuthenticated()) {
        const userData = getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  };

  const signOut = () => {
    setUser(null);
    cognitoSignOut();
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('AuthContext: Checking authentication...');
        const authStatus = isAuthenticated();
        console.log('AuthContext: isAuthenticated =', authStatus);
        
        if (authStatus) {
          const userData = getCurrentUser();
          console.log('AuthContext: User data =', userData);
          setUser(userData);
        } else {
          console.log('AuthContext: No user authenticated');
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};