'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeedPost from '@/components/feed/feed-post';
import CreatePost from '@/components/feed/create-post';
import { useAuth } from '@/context/AuthContext';
import { Globe } from 'lucide-react';

export default function Home() {
  const [sort, setSort] = useState('newest');
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: isAuthLoading } = useAuth();

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/media');
      const data = await response.json();
      if (Array.isArray(data)) {
        setMediaList(data);
        console.log('Fetched media list:', data);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);
  
  const sortedMedia = [...mediaList].sort((a, b) => {
    switch (sort) {
      case 'popular':
        return b.likes_count - a.likes_count;
      case 'most-viewed':
        return b.views_count - a.views_count;
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Feed Header */}
      <div className="sticky top-0 z-20 flex flex-col gap-0 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="px-4 py-3">
          <h1 className="text-xl font-black uppercase tracking-tight font-heading text-foreground">Home Feed</h1>
        </div>
        <Tabs defaultValue="newest" onValueChange={setSort} className="w-full">
          <TabsList className="h-12 w-full justify-start rounded-none border-none bg-transparent p-0">
            <TabsTrigger 
              value="newest" 
              className="flex-1 rounded-none border-b-2 border-transparent px-8 text-[10px] font-black uppercase tracking-[0.2em] font-action data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-muted-foreground/60 transition-all duration-300"
            >
              For You
            </TabsTrigger>
            <TabsTrigger 
              value="popular" 
              className="flex-1 rounded-none border-b-2 border-transparent px-8 text-[10px] font-black uppercase tracking-[0.2em] font-action data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-muted-foreground/60 transition-all duration-300"
            >
              Trending
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col flex-1 pb-20 md:pb-0">
        {/* Post Creation Area */}
        <CreatePost onPostCreated={fetchMedia} />
        
        {/* Feed Content */}
        <div className="flex flex-col">
          {isLoading ? (
            <div className="flex flex-col">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4 border-b border-border/50 p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-secondary/30" />
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-32 rounded bg-secondary/30" />
                      <div className="h-3 w-20 rounded bg-secondary/30" />
                    </div>
                  </div>
                  <div className="h-4 w-full rounded bg-secondary/30" />
                  <div className="h-64 w-full rounded-2xl bg-secondary/30" />
                </div>
              ))}
            </div>
          ) : sortedMedia.length > 0 ? (
            <div className="flex flex-col divide-y divide-border/50">
              {sortedMedia.map((mediaItem) => (
                <FeedPost key={mediaItem.id} post={{
                  id: mediaItem.id.toString(),
                  content: mediaItem.description || mediaItem.title || 'Check out this new media!',
                  mediaUrl: mediaItem.media_url || mediaItem.thumbnail_url,
                  mediaType: (mediaItem.type as 'photo' | 'video') || 'photo',
                  createdAt: new Date(mediaItem.created_at),
                  user: {
                    name: mediaItem.display_name || 'Anonymous', // Use display_name
                    handle: mediaItem.username || 'anonymous', // Use username
                    avatar: mediaItem.uploader_avatar || ''
                  },
                  likes: mediaItem.likes_count || 0,
                  comments: mediaItem.comments_count || 0
                }} />
              ))}
            </div>
          ) : (            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-black font-heading uppercase tracking-tight">Nothing to see yet</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2 max-w-xs">
                Be the first to share something with the world!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
