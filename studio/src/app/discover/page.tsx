'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import DiscoverMediaCard from '@/components/discover/media-card';

export default function DiscoverPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchMedia = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const response = await fetch('/api/media?limit=20');
      const data = await response.json();

      // Handle new paginated API response
      const posts = data.posts || [];

      if (Array.isArray(posts)) {
        // Assign random ratios to media items for the masonry effect
        const ratios = ['aspect-[3/4]', 'aspect-square', 'aspect-[2/3]', 'aspect-[4/5]'];
        const dataWithRatios = posts.map(item => ({
          ...item,
          ratio: ratios[Math.floor(Math.random() * ratios.length)]
        }));

        // Shuffling to simulate a "random" discover feed
        const shuffled = [...dataWithRatios].sort(() => Math.random() - 0.5);

        setMediaList(prev => isInitial ? shuffled : [...prev, ...shuffled]);
        setHasMore(data.hasMore || false);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia(true);
  }, [fetchMedia]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore && !isLoading) {
          fetchMedia();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, isLoading, fetchMedia]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-0.5">
        {isLoading ? (
          <div className="columns-2 gap-0.5 sm:columns-3 md:columns-4 lg:columns-5">
            {[...Array(15)].map((_, i) => (
              <Skeleton
                key={i}
                className={`w-full mb-0.5 rounded-none bg-muted ${i % 3 === 0 ? 'h-64' : i % 3 === 1 ? 'h-40' : 'h-52'
                  }`}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="columns-2 gap-0.5 sm:columns-3 md:columns-4 lg:columns-5">
              {mediaList.map((mediaItem, index) => (
                <div key={`${mediaItem.id}-${index}`} className="mb-0.5 break-inside-avoid">
                  <DiscoverMediaCard
                    media={{
                      id: mediaItem.id.toString(),
                      type: mediaItem.type || 'photo',
                      title: mediaItem.title,
                      thumbnailUrl: mediaItem.thumbnail_url || mediaItem.media_url,
                      description: mediaItem.description,
                      likes: mediaItem.likes_count || 0,
                      commentsCount: 0,
                      ratio: mediaItem.ratio,
                      isGallery: Math.random() > 0.8
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div
              ref={observerTarget}
              className="h-20 flex items-center justify-center mt-4 mb-10"
            >
              {isFetchingMore && (
                <Loader2 className="w-6 h-6 animate-spin text-neutral-800" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
