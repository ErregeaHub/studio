'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your account...');
  const token = searchParams.get('token');

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Account verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Invalid or expired verification token.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again later.');
      }
    }

    verifyToken();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      <Card className="w-full max-w-md border-border/50 bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
        <CardHeader className="text-center pt-10 pb-8 px-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/5">
            {status === 'loading' && <Loader2 className="w-8 h-8 text-primary animate-spin" />}
            {status === 'success' && <CheckCircle2 className="w-8 h-8 text-green-500" />}
            {status === 'error' && <XCircle className="w-8 h-8 text-destructive" />}
          </div>
          <CardTitle className="font-heading text-3xl font-black uppercase tracking-tight mb-2">
            {status === 'loading' && 'Verifying...'}
            {status === 'success' && 'Verified!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
          <CardDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardFooter className="flex flex-col gap-4 pb-10 px-8">
          {status !== 'loading' && (
            <Button className="w-full h-12 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20" asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          )}
          {status === 'error' && (
            <Button variant="ghost" className="w-full h-12 rounded-full font-bold uppercase tracking-widest text-[10px] text-muted-foreground hover:text-foreground" asChild>
              <Link href="/signup">Back to Signup</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
