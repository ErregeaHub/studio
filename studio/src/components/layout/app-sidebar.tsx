'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Compass, User, Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';

export default function AppSidebar({ className }: { className?: string }) {
  const { user } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <aside className={cn(
      "hidden flex-shrink-0 flex-col border-r bg-background p-4 md:flex transition-all duration-300",
      isCollapsed ? "w-20" : "w-64",
      className
    )}>
      <Link href="/" className={cn("mb-10 flex items-center gap-3 px-2", isCollapsed && "justify-center px-0")}>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
          <Clapperboard className="h-6 w-6 text-white" />
        </div>
        {!isCollapsed && <span className="text-2xl font-black tracking-tight font-heading uppercase truncate">MediaFlow</span>}
      </Link>

      <nav className="flex flex-col gap-1">
        <h3 className={cn("mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 font-action", isCollapsed && "text-center px-0")}>
          {isCollapsed ? "Menu" : "Main Menu"}
        </h3>
        <Button variant="ghost" className={cn("h-12 justify-start gap-4 rounded-xl px-4 text-base font-semibold transition-all hover:bg-primary/10 hover:text-primary", isCollapsed && "justify-center px-0")} asChild title="Home">
          <Link href="/">
            <Home className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && "Home"}
          </Link>
        </Button>
        <Button variant="ghost" className={cn("h-12 justify-start gap-4 rounded-xl px-4 text-base font-semibold transition-all hover:bg-primary/10 hover:text-primary", isCollapsed && "justify-center px-0")} asChild title="Discover">
          <Link href="/discover">
            <Compass className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && "Discover"}
          </Link>
        </Button>
        <Button variant="ghost" className={cn("h-12 justify-start gap-4 rounded-xl px-4 text-base font-semibold transition-all hover:bg-primary/10 hover:text-primary", isCollapsed && "justify-center px-0")} asChild title="Profile">
          <Link href={user ? `/profile/${user.username}` : '/login'}>
            <User className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && "Profile"}
          </Link>
        </Button>
      </nav>

    </aside>
  );
}
