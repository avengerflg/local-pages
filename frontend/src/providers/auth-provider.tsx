'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/api';
import { api } from '../lib/api-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const res = await api.get<{data: User}>('/auth/me');
          setUser(res.data);
        } catch {
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      localStorage.removeItem('auth_token');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    setUser(user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {} finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      window.location.assign('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
