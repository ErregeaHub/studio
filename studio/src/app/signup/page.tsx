'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema, SignupInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, ShieldCheck, Mail, Phone, User } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      display_name: '',

      terms: false,
    },
  });

  async function onSubmit(data: SignupInput) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details) {
          // Map backend validation errors back to form
          Object.entries(result.details).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              form.setError(key as keyof SignupInput, { message: value[0] });
            }
          });
        }
        throw new Error(result.error || 'Signup failed');
      }

      toast({
        title: 'Registration Successful!',
        description: 'Please check your email to verify your account.',
      });
      router.push('/verify-email');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl border-border/50 bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
        <CardHeader className="space-y-4 pb-8 pt-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <span className="text-2xl font-black text-white">M</span>
          </div>
          <div className="space-y-1">
            <CardTitle className="font-heading text-3xl font-black uppercase tracking-tight">Create Account</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Join the MediaFlow community today
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary px-1">Personal Details</h3>
                  <FormField
                    control={form.control}
                    name="display_name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Johnny" {...field} className="h-11 rounded-xl border-border/50 bg-background focus-visible:ring-primary/20" />
                        </FormControl>
                        <FormMessage className="text-[10px] uppercase font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Account Info Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary px-1">Account Info</h3>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">@</span>
                            <Input placeholder="username" {...field} className="h-11 pl-7 rounded-xl border-border/50 bg-background focus-visible:ring-primary/20" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] uppercase font-bold" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} className="h-11 rounded-xl border-border/50 bg-background focus-visible:ring-primary/20" />
                        </FormControl>
                        <FormMessage className="text-[10px] uppercase font-bold" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border/50">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="h-11 rounded-xl border-border/50 bg-background focus-visible:ring-primary/20" />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="h-11 rounded-xl border-border/50 bg-background focus-visible:ring-primary/20" />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-border/50 bg-background/50 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="rounded-md border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest cursor-pointer">
                        Accept terms and conditions
                      </FormLabel>
                      <FormDescription className="text-[10px] uppercase tracking-tighter">
                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-12 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Creating Account...' : 'Join MediaFlow'}
              </Button>

              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline transition-all ml-1">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
