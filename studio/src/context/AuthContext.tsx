'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  avatar_url?: string;
  bio?: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Verify user still exists in DB to prevent foreign key errors
          const response = await fetch(`/api/users/${parsedUser.username}`);
          if (response.ok) {
            setUser(parsedUser);
          } else {
            // User no longer exists or error, clear session
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const authenticatedUser: User = await response.json();
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
    } catch (error: any) {
      console.error('Login error:', error);
      throw error; // Re-throw to be handled by the calling component
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
