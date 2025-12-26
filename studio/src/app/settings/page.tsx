'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, LogOut, Shield, Bell, User, Mail, Lock, Camera } from 'lucide-react';
import React from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);

  // Sync state with user data from AuthContext
  React.useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch(`/api/users/${user.id}/avatar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload avatar');
      
      const updatedUser = await response.json();
      updateUser(updatedUser);
      toast({ title: "Success", description: "Avatar updated successfully" });
    } catch (error: any) {
      console.error('Password change error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName, username, bio }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedUser = await response.json();
      updateUser(updatedUser);
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
      return;
    }

    if (newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user?.id,
          currentPassword,
          newPassword,
          confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to change password');
      
      toast({ title: "Success", description: "Password updated successfully" });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Password change error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/95 backdrop-blur">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="mr-2 h-11 w-11"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-8 pb-10">
        {/* 1. Account Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold uppercase tracking-wider text-muted-foreground">Account Settings</h2>
          </div>
          
          <Card className="border-none shadow-none bg-accent/30 rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              {/* Profile Edit */}
              <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarImage src={user.avatar_url} className="object-cover aspect-square" />
                    <AvatarFallback className="text-2xl">{user.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                      <div className="h-6 w-6 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 rounded-full active:scale-95 transition-all"
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                </Button>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Recommended: 1:1 Square Image
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                    className="h-12 bg-background border-none focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="h-12 bg-background border-none focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    className="min-h-[100px] bg-background border-none focus-visible:ring-primary resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-bold active:scale-95 transition-all"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>

              {/* Account Information */}
              <div className="pt-6 border-t space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Account Information</h3>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">Linked Email</Label>
                  <Input 
                    id="email" 
                    value={user.email} 
                    disabled 
                    className="h-12 bg-muted/50 border-none cursor-not-allowed opacity-80"
                  />
                  <p className="text-xs text-muted-foreground px-1">Email address cannot be changed for security reasons.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Security */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold uppercase tracking-wider text-muted-foreground">Security</h2>
          </div>

          <Card className="border-none shadow-none bg-accent/30 rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleChangePassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 bg-background border-none focus-visible:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 bg-background border-none focus-visible:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 bg-background border-none focus-visible:ring-primary"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="secondary"
                  className="w-full h-12 rounded-xl font-bold active:scale-95 transition-all"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Updating...' : 'Change Password'}
                </Button>
              </form>

              <div className="pt-6 border-t">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full h-12 rounded-xl font-bold active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[90%] rounded-2xl max-w-sm mx-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will be signed out of your account. You'll need to sign back in to access your content.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col gap-2 pt-4">
                      <AlertDialogAction 
                        onClick={logout}
                        className="h-12 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95 transition-all"
                      >
                        Yes, Logout
                      </AlertDialogAction>
                      <AlertDialogCancel className="h-12 rounded-xl border-none bg-muted hover:bg-muted/80 active:scale-95 transition-all">
                        Cancel
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 3. Notifications */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold uppercase tracking-wider text-muted-foreground">Notifications</h2>
          </div>

          <Card className="border-none shadow-none bg-accent/30 rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-bold">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Sound and vibration alerts</p>
                </div>
                <Switch 
                  checked={pushEnabled} 
                  onCheckedChange={setPushEnabled}
                  className="data-[state=checked]:bg-primary h-7 w-12"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox 
                  id="marketing" 
                  checked={emailMarketing} 
                  onCheckedChange={(checked) => setEmailMarketing(checked as boolean)}
                  className="h-6 w-6 rounded-md border-primary data-[state=checked]:bg-primary"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="marketing" className="text-base font-bold leading-none cursor-pointer">
                    Email Marketing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive news and promotional content.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
