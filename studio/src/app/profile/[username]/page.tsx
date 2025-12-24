'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MediaCard from '@/components/media-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [user, setUser] = useState<any>(null);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
 

  const { user: currentUser, isLoading: isCurrentUserLoading } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`/api/users/${username}`);
        if (response.status === 404) {
          setError(true);
          return;
        }
        const data = await response.json();
        setUser(data.user);
        setMediaList(data.media);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  if (error) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl py-8">
        <div className="flex flex-col items-center gap-4 mb-12">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full mb-8" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-video w-full animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const photos = mediaList.filter(m => m.type === 'photo');
  const videos = mediaList.filter(m => m.type === 'video');

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="relative mb-6">
          <Avatar className="h-28 w-28 md:h-40 md:w-40 ring-4 ring-primary/10 shadow-2xl">
            <AvatarImage src={user.avatar_url || '/avatars/default.png'} alt={user.display_name} className="object-cover" />
            <AvatarFallback className="bg-primary/5 text-primary text-3xl font-bold">{user.display_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg border-4 border-background md:p-3">
             <div className="h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase">Pro</span>
             </div>
          </div>
        </div>
        <h1 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight mb-2">{user.display_name}</h1>
        
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">@{user.username}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{mediaList.length} Posts</span>
        </div>
        {user.bio && (
          <p className="max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
            {user.bio}
          </p>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center mb-10 sticky top-16 z-20 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-secondary/30 p-1 rounded-full border border-border/50">
            <TabsTrigger value="all" className="rounded-full text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">All</TabsTrigger>
            <TabsTrigger value="photos" className="rounded-full text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Photos</TabsTrigger>
            <TabsTrigger value="videos" className="rounded-full text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Videos</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <MediaGrid mediaList={mediaList} />
        </TabsContent>
        <TabsContent value="photos">
          <MediaGrid mediaList={photos} />
        </TabsContent>
        <TabsContent value="videos">
          <MediaGrid mediaList={videos} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MediaGrid({ mediaList }: { mediaList: any[] }) {
  if (mediaList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-secondary/10 rounded-3xl border border-dashed border-border/50">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">No content shared yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {mediaList.map((mediaItem) => (
        <MediaCard key={mediaItem.id} media={{
          ...mediaItem,
          id: mediaItem.id.toString(),
          thumbnailUrl: mediaItem.thumbnail_url,
          user: {
            id: mediaItem.uploader_id,
            name: mediaItem.display_name || mediaItem.username,
            avatar: mediaItem.avatar_url || '/avatars/default.png'
          },
          createdAt: new Date(mediaItem.created_at),
          views: mediaItem.views_count,
          likes: mediaItem.likes_count
        }} />
      ))}
    </div>
  );
}
