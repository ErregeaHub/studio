'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clapperboard, PlusSquare, Search, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Clapperboard, label: 'Discover', href: '/discover' },
    { icon: PlusSquare, label: 'Create', href: '/uploads', action: 'create posts' },
    { icon: Search, label: 'Search', href: '/search' },
    { 
      icon: User, 
      label: 'Profile', 
      href: user ? `/profile/${user?.username}` : '/login',
      action: 'view your profile'
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border/50 bg-background/80 px-2 pb-safe backdrop-blur-xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        const content = (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-all duration-300",
              isActive ? "text-primary" : "text-muted-foreground active:text-primary"
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center">
              {item.label === 'Profile' && user?.avatar_url ? (
                <div className={cn(
                  "h-6 w-6 rounded-full overflow-hidden border",
                  isActive ? "border-primary" : "border-transparent"
                )}>
                  <Image 
                    src={user.avatar_url} 
                    alt="Profile" 
                    width={24} 
                    height={24} 
                    className="object-cover"
                  />
                </div>
              ) : (
                <Icon className={cn("h-6 w-6", isActive && item.label !== 'Create' && "stroke-[2.5px]")} />
              )}
            </div>
          </Link>
        );

        if (item.action) {
          return (
            <AuthGuard key={item.href} action={item.action} mode="dialog">
              {content}
            </AuthGuard>
          );
        }

        return content;
      })}
    </nav>
  );
}
