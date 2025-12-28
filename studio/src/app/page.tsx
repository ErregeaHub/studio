'use client';

import { SpeedInsights } from "@vercel/speed-insights/next";
import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeedPost from '@/components/feed/feed-post';
import CreatePost from '@/components/feed/create-post';
import { useAuth } from '@/context/AuthContext';
import { Globe } from 'lucide-react';

export default function Home() {
  const [sort, setSort] = useState('newest');
  const { user, isLoading: isAuthLoading } = useAuth();

  // Infinite scroll query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['media', sort, user?.id],
    queryFn: async ({ pageParam }) => {
      const url = sort === 'following' && user
        ? `/api/media?following=true&userId=${user.id}&cursor=${pageParam || ''}&limit=10`
        : `/api/media?sort=${sort}&cursor=${pageParam || ''}&limit=10`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch media');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
    enabled: !isAuthLoading,
  });

  // Intersection observer for auto-loading
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  // Auto-fetch when scrolling near bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSort(value);
  };

  // Flatten all pages into single array
  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Feed Header */}
      <div className="sticky top-0 z-20 flex flex-col gap-0 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="px-4 py-3">
          <h1 className="text-xl font-black uppercase tracking-tight font-heading text-foreground">Home Feed</h1>
        </div>
        <Tabs value={sort} onValueChange={handleSortChange} className="w-full">
          <TabsList className="h-12 w-full justify-start rounded-none border-none bg-transparent p-0">
            <TabsTrigger
              value="newest"
              className="flex-1 rounded-none border-b-2 border-transparent px-8 text-[10px] font-black uppercase tracking-[0.2em] font-action data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-muted-foreground/60 transition-all duration-300"
            >
              For You
            </TabsTrigger>
            {user && (
              <TabsTrigger
                value="following"
                className="flex-1 rounded-none border-b-2 border-transparent px-8 text-[10px] font-black uppercase tracking-[0.2em] font-action data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-muted-foreground/60 transition-all duration-300"
              >
                Following
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col flex-1 pb-20 md:pb-0">
        {/* Post Creation Area */}
        <CreatePost onPostCreated={() => refetch()} />

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
          ) : allPosts.length > 0 ? (
            <>
              <div className="flex flex-col divide-y divide-border/50">
                {allPosts.map((mediaItem) => (
                  <FeedPost key={mediaItem.id} post={{
                    id: mediaItem.id.toString(),
                    content: mediaItem.description || mediaItem.title || '',
                    mediaUrl: mediaItem.media_url || undefined,
                    mediaType: (mediaItem.type as 'photo' | 'video' | 'text') || 'photo',
                    createdAt: new Date(mediaItem.created_at),
                    user: {
                      name: mediaItem.display_name || 'Anonymous',
                      handle: mediaItem.username || 'anonymous',
                      avatar: mediaItem.uploader_avatar || ''
                    },
                    likes: mediaItem.likes_count || 0,
                    comments: mediaItem.comments_count || 0
                  }} />
                ))}
              </div>

              {/* Loading trigger - invisible element at bottom */}
              <div ref={ref} className="h-20 flex items-center justify-center">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-xs font-bold uppercase tracking-wider">Loading more...</span>
                  </div>
                ) : hasNextPage ? (
                  <span className="text-xs text-muted-foreground/50 uppercase tracking-widest">Scroll for more</span>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">You've reached the end!</span>
                    <span className="text-[10px] text-muted-foreground/50">That's all for now</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
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
