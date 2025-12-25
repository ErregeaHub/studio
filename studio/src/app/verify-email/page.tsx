'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Mail, Loader2, Send } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Try to get email from localStorage or session (if you saved it during signup)
    const savedEmail = localStorage.getItem('pending_verification_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'We couldn\'t find your email address. Please try signing up again.',
      });
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch('/api/auth/verify/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to resend email');
      }

      toast({
        title: 'Email Sent',
        description: 'A new verification link has been sent to your email.',
      });
      setCooldown(60); // 1 minute cooldown
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      <Card className="w-full max-w-md border-border/50 bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
        <CardHeader className="text-center pt-10 pb-8 px-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/5">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="font-heading text-3xl font-black uppercase tracking-tight mb-2">Check your email</CardTitle>
          <CardDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
            We&apos;ve sent a verification link to your email address{email ? ` (${email})` : ''}. 
            Please click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4 pb-10 px-8">
          <Button className="w-full h-12 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20" asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full h-12 rounded-full font-bold uppercase tracking-widest text-[10px] text-muted-foreground hover:text-foreground"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
          >
            {isResending ? (
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
            ) : (
              <Send className="w-3 h-3 mr-2" />
            )}
            {cooldown > 0 ? `Resend Email in ${cooldown}s` : 'Resend Verification Email'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

