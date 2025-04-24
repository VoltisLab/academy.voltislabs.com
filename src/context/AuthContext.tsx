'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData } from '@/lib/types';

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  setUser: (user: UserData) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: () => {},
  setUser: () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    
    if (token) {
      // Optionally, you can validate the token or fetch user data here
      // For now, we'll just set isLoading to false
      setIsLoading(false);
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated: !!user,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};