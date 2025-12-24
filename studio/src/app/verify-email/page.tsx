'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      <Card className="w-full max-w-md border-border/50 bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
        <CardHeader className="text-center pt-10 pb-8 px-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/5">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="font-heading text-3xl font-black uppercase tracking-tight mb-2">Check your email</CardTitle>
          <CardDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
            We&apos;ve sent a verification link to your email address. 
            Please click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pb-10 px-8">
          <Button className="w-full h-12 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20" asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
