'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AuthGuardProps {
  children: React.ReactNode;
  action?: string;
  fallback?: React.ReactNode;
  mode?: 'redirect' | 'dialog' | 'none';
}

export function AuthGuard({ 
  children, 
  action = "perform this action", 
  fallback,
  mode = 'dialog' 
}: AuthGuardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const handleIntercept = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      
      if (mode === 'redirect') {
        router.push('/login');
      } else if (mode === 'dialog') {
        setShowDialog(true);
      }
    }
  };

  if (!user && fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      <div onClickCapture={handleIntercept} className="contents">
        {children}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-none rounded-3xl border-border/50 bg-background/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading font-black uppercase tracking-tight text-xl">Login Required</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              You need to be logged in to {action}. Would you like to go to the login page now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3">
            <AlertDialogCancel className="flex-1 rounded-full font-bold uppercase tracking-widest text-[10px] h-11 border-border/50 active:bg-secondary transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => router.push('/login')}
              className="flex-1 rounded-full font-bold uppercase tracking-widest text-[10px] h-11 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            >
              Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
