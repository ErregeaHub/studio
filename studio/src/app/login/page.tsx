'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoading: isAuthLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Login Successful',
        description: 'You have been successfully logged in.',
      });
      router.push('/');
    } catch (err: any) {
      toast({
        title: 'Login Failed',
        description: err.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border/50 bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
        <CardHeader className="space-y-4 pb-8 pt-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <span className="text-2xl font-black text-white">M</span>
          </div>
          <div className="space-y-1">
            <CardTitle className="font-heading text-3xl font-black uppercase tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Enter your credentials to continue
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-primary/20 font-medium"
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-primary/20 font-medium"
                  required 
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button 
                  onClick={() => router.push('/signup')} 
                  className="text-primary hover:underline transition-all ml-1"
                  type="button"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
