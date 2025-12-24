'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function RightSidebar() {
  return (
    <aside className="hidden w-80 flex-shrink-0 flex-col gap-6 p-6 lg:flex">
      {/* Search Bar - Moved from header to here or kept in header */}
      
      <Card className="flex flex-col gap-4 border-none bg-secondary/30 p-4 rounded-2xl">
        <div className="flex items-center gap-2 px-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-action">Trending Now</h3>
        </div>
        <div className="flex flex-col gap-3">
          {['#NaturePhotography', '#CinematicVideo', '#VlogLife', '#CreativeFlow'].map((tag) => (
            <Link key={tag} href={`/search?q=${tag.replace('#', '')}`} className="group flex flex-col px-2">
              <span className="text-sm font-bold group-hover:text-primary transition-colors">{tag}</span>
              <span className="text-[10px] text-muted-foreground uppercase">1.2k posts</span>
            </Link>
          ))}
        </div>
        <Button variant="link" className="text-xs text-primary self-start px-2">Show more</Button>
      </Card>

      <Card className="flex flex-col gap-4 border-none bg-secondary/30 p-4 rounded-2xl">
        <div className="flex items-center gap-2 px-2">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-action">Who to follow</h3>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { name: 'Alex Rivera', handle: 'arivera', avatar: 'https://i.pravatar.cc/150?u=alex' },
            { name: 'Sarah Chen', handle: 'schen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
          ].map((user) => (
            <div key={user.handle} className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground">@{user.handle}</span>
                </div>
              </div>
              <Button size="sm" className="h-7 rounded-full px-3 text-[10px] font-bold uppercase tracking-wider">Follow</Button>
            </div>
          ))}
        </div>
        <Button variant="link" className="text-xs text-primary self-start px-2">Show more</Button>
      </Card>

      <footer className="px-4 text-[10px] text-muted-foreground uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-2">
        <Link href="#">About</Link>
        <Link href="#">Help</Link>
        <Link href="#">Terms</Link>
        <Link href="#">Privacy</Link>
        <span>© 2024 MediaFlow</span>
      </footer>
    </aside>
  );
}
