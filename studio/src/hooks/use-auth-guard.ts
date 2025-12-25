'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export function useAuthGuard() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const checkAuth = useCallback((action?: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: action ? `Please log in to ${action}.` : "Please log in to continue.",
        duration: 2000,
      });
      
      // Smooth redirect to login page
      router.push('/login');
      return false;
    }
    return true;
  }, [user, router, toast]);

  const guardAction = useCallback((fn: (...args: any[]) => void, action?: string) => {
    return (...args: any[]) => {
      if (checkAuth(action)) {
        fn(...args);
      }
    };
  }, [checkAuth]);

  return {
    isAuthenticated: !!user,
    checkAuth,
    guardAction,
  };
}
