'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/api';
import { api } from '../lib/api-client';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

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
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const res = await api.get<{data: User}>('/auth/me');
          setUser(res.data);
        } catch {
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      localStorage.removeItem('auth_token');
      queryClient.clear();
      router.push('/login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [router, queryClient]);

  const loginAction = useCallback((token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    setUser(user);
    if (user.role === 'customer') {
      router.push('/customer');
    }
  }, [router]);

  const logoutAction = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {} finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      queryClient.clear();
      router.push('/login');
    }
  }, [router, queryClient]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login: loginAction, logout: logoutAction }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
