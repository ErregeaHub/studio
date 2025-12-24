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
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors hidden md:flex"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="flex items-center gap-2 md:hidden">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-xl">M</span>
          </div>
          <span className="font-heading font-black text-lg tracking-tighter uppercase">MediaFlow</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {isUserLoading ? (
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        ) : user ? (
          <>
            <Button 
              variant="default" 
              size="sm" 
              className="hidden md:flex rounded-full font-bold uppercase tracking-wider font-action gap-2" 
              asChild
            >
              <Link href="/uploads">
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-full hover:bg-primary/10 hover:text-primary transition-colors" 
              asChild
            >
              <Link href="/uploads">
                <Upload className="h-5 w-5" />
              </Link>
            </Button>
            
            <NotificationBell />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/30 transition-all p-0">
                  <Avatar className="h-9 w-9">
                    {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.display_name || user.email || ''} />}
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{getInitials(user.display_name, user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl border-border/50 bg-background/95 backdrop-blur-lg" align="end">
                <DropdownMenuLabel className="font-heading uppercase tracking-wider text-[10px] text-muted-foreground">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary rounded-lg transition-colors cursor-pointer">
                  <Link href={`/profile/${user.username}`}>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary rounded-lg transition-colors cursor-pointer">
                  <Link href={`/settings/profile/${user.username}`}>
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="focus:bg-destructive/10 focus:text-destructive rounded-lg transition-colors cursor-pointer text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button size="sm" className="rounded-full font-bold uppercase tracking-wider font-action px-6" onClick={() => router.push('/login')}>
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
