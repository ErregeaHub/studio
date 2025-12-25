'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';
import NotificationBell from '@/components/notifications/notification-bell';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function AppHeader() {
  const { user, isLoading: isUserLoading, logout } = useAuth();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    logout();
    router.push('/');
  };
  
  const getInitials = (displayName?: string | null, email?: string | null) => {
    if (displayName) return displayName.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return 'U';
  };


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 px-4 backdrop-blur-md">
      <div className="flex-1 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-xl">R</span>
          </div>
          <span className="font-heading font-black text-lg tracking-tighter uppercase">RedRAW</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {isUserLoading ? (
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        ) : (
          <>
            <AuthGuard action="upload media" mode="dialog">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full active:bg-primary/10 active:text-primary transition-colors" 
                asChild
              >
                <Link href="/uploads">
                  <Upload className="h-5 w-5" />
                </Link>
              </Button>
            </AuthGuard>
            
            <AuthGuard action="view notifications" mode="dialog">
              <NotificationBell />
            </AuthGuard>
            
            {user ? (
               <Button 
                 variant="ghost" 
                 className="relative h-10 w-10 rounded-full ring-2 ring-transparent active:ring-primary/30 transition-all p-0"
                 asChild
               >
                 <Link href={`/profile/${user.username}`}>
                   <Avatar className="h-9 w-9">
                     {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.display_name || user.email || ''} />}
                     <AvatarFallback className="bg-primary/10 text-primary font-bold">{getInitials(user.display_name, user.email)}</AvatarFallback>
                   </Avatar>
                 </Link>
               </Button>
             ) : (
               <Button size="sm" className="rounded-full font-bold uppercase tracking-wider font-action px-6" onClick={() => router.push('/login')}>
                 Login
               </Button>
             )}
          </>
        )}
      </div>
    </header>
  );
}
