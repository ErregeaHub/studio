'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MediaCard from '@/components/media-card';
import { Skeleton } from '@/components/ui/skeleton';

import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Users, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FeedPost from '@/components/feed/feed-post';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    async function performSearch() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setResults(data);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Search Header */}
      <div className="sticky top-0 z-20 flex flex-col gap-4 border-b border-border/50 bg-background/80 px-4 py-4 backdrop-blur-md">
        <form onSubmit={handleSearch} className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search users, posts, or keywords..." 
            className="pl-11 h-12 rounded-2xl bg-secondary/10 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium text-sm"
          />
        </form>
      </div>

      <div className="flex-1 flex flex-col pb-20 md:pb-0">
        {!query ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-lg shadow-primary/5">
              <SearchIcon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-black font-heading uppercase tracking-tight">Search MediaFlow</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-3 max-w-xs leading-relaxed">
              Find creators, specific posts, or topics that interest you.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col divide-y divide-border/50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-4 p-4 animate-pulse">
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
        ) : results.length > 0 ? (
          <div className="flex flex-col">
            <div className="px-4 py-3 bg-secondary/5 border-b border-border/50">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Found {results.length} {results.length === 1 ? 'result' : 'results'}
              </span>
            </div>
            <div className="flex flex-col divide-y divide-border/50">
              {results.map((mediaItem) => (
                <FeedPost key={mediaItem.id} post={{
                  id: mediaItem.id.toString(),
                  content: mediaItem.description || mediaItem.title || 'Check out this new media!',
                  mediaUrl: mediaItem.media_url || mediaItem.thumbnail_url,
                  mediaType: (mediaItem.type as 'photo' | 'video') || 'photo',
                  createdAt: new Date(mediaItem.created_at),
                  user: {
                    name: mediaItem.uploader_name || 'Anonymous',
                    handle: mediaItem.uploader_username || 'anonymous',
                    avatar: mediaItem.uploader_avatar || ''
                  },
                  likes: mediaItem.likes_count || 0,
                  comments: mediaItem.comments_count || 0
                }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="h-16 w-16 rounded-3xl bg-secondary/10 flex items-center justify-center mb-6 ring-1 ring-border/50">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-black font-heading uppercase tracking-tight">No results found</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-3 max-w-xs leading-relaxed">
              Try searching for something else or check your spelling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-20 flex flex-col gap-4 border-b border-border/50 bg-background/80 px-4 py-4 backdrop-blur-md">
          <div className="h-12 w-full rounded-2xl bg-secondary/10 animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
