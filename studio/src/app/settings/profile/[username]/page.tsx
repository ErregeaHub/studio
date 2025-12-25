"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserSchema } from '@/lib/validations';

const ProfileUpdateSchema = UserSchema.partial();
type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

import { useParams } from 'next/navigation';

const ProfileSettingsPage = () => {
  const params = useParams();
  const { username } = params;

  const { toast } = useToast();
  const { checkAuth } = useAuthGuard();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(ProfileUpdateSchema),
  });

  const { user: currentUser, updateUser, isLoading: isUserLoading } = useAuth();
  const [profileUser, setProfileUser] = useState<typeof currentUser | null>(null);

  useEffect(() => {
    if (!isUserLoading && !currentUser) {
      checkAuth('manage settings');
    }
  }, [currentUser, isUserLoading, checkAuth]);

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (username) {
        try {
          const response = await fetch(`/api/users/${username}`);
          if (!response.ok) {
            throw new Error('Failed to fetch profile user');
          }
          const data = await response.json();
          setProfileUser(data);
          reset({
            display_name: data.display_name || '',
            email: data.email || '',
          });
        } catch (error) {
          console.error('Error fetching profile user:', error);
          toast({
            title: "Error",
            description: "Could not load profile data.",
            variant: "destructive",
          });
        }
      }
    };
    fetchProfileUser();
  }, [username, reset, toast]);

  useEffect(() => {
    if (profileUser) {
      reset({
        display_name: profileUser.display_name || '',
        email: profileUser.email || '',
      });
    }
  }, [profileUser, reset]);


  const onSubmit = async (data: ProfileUpdateInput) => {
    if (!profileUser) {
      toast({
        title: "Error",
        description: "Profile user data not loaded.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/users/update/${profileUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setProfileUser(updatedUser); // Update local profile user state
      if (currentUser && currentUser.id === updatedUser.id) {
        updateUser(updatedUser); // Update global auth context if current user's profile is updated
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your public profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                {...register('display_name')}
                placeholder="Your display name"
              />
              {errors.display_name && (
                <p className="text-red-500 text-sm">{errors.display_name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsPage;
