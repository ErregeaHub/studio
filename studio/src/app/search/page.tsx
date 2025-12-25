'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Users, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FeedPost from '@/components/feed/feed-post';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

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

  const users = results.filter(r => r.type === 'user');
  const posts = results.filter(r => r.type === 'post');

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
            <h2 className="text-xl font-black font-heading uppercase tracking-tight">Search RedRAW</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-3 max-w-xs leading-relaxed">
              Find creators, specific posts, or topics that interest you.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="flex flex-col divide-y divide-border/50">
            {users.length > 0 && (
              <div className="flex flex-col">
                <div className="px-4 py-3 bg-secondary/5 border-b border-border/50">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Creators
                  </span>
                </div>
                {users.map((user) => (
                  <Link 
                    key={user.id} 
                    href={`/profile/${user.username}`}
                    className="flex items-center gap-4 p-4 hover:bg-secondary/10 transition-colors active:scale-[0.98]"
                  >
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.display_name?.charAt(0) || user.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm truncate">{user.display_name || user.username}</span>
                      <span className="text-xs text-muted-foreground truncate">@{user.username}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {posts.length > 0 && (
              <div className="flex flex-col">
                <div className="px-4 py-3 bg-secondary/5 border-b border-border/50">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Posts
                  </span>
                </div>
                {posts.map((post) => (
                  <FeedPost 
                    key={post.id} 
                    post={{
                      id: post.id.toString(),
                      content: post.title || post.description || '',
                      mediaUrl: post.media_url,
                      mediaType: post.type,
                      createdAt: new Date(post.created_at),
                      user: {
                        name: post.display_name || post.username,
                        handle: post.username,
                        avatar: post.avatar_url || ''
                      },
                      likes: post.likes_count || 0,
                      comments: 0 // Placeholder
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <h2 className="text-lg font-bold">No results found for "{query}"</h2>
            <p className="text-sm text-muted-foreground mt-2">Try searching for something else.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
