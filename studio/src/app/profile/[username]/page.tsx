'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MediaCard from '@/components/media-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UploadCloud, UserPlus, UserCheck, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAuthGuard } from '@/hooks/use-auth-guard';

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [user, setUser] = useState<any>(null);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();
  const { checkAuth } = useAuthGuard();
  const router = useRouter();

  const { user: currentUser, isLoading: isCurrentUserLoading } = useAuth();

  useEffect(() => {
    if (!isCurrentUserLoading && !currentUser) {
      checkAuth('view profiles');
    }
  }, [currentUser, isCurrentUserLoading, checkAuth]);

  const fetchStats = useCallback(async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setFollowersCount(data.followersCount);
        setFollowingCount(data.followingCount);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  const checkFollowStatus = useCallback(async (userId: number, currentUserId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}/follow?follower_id=${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error('Failed to check follow status:', error);
    }
  }, []);

  const handleFollow = async () => {
    if (!currentUser || !user) return;

    try {
      const response = await fetch(`/api/users/${user.id}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: currentUser.id })
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        setFollowersCount(prev => data.isFollowing ? prev + 1 : prev - 1);
        toast({
          title: data.isFollowing ? "Followed" : "Unfollowed",
          description: data.isFollowing ? `You are now following ${user.display_name}` : `You unfollowed ${user.display_name}`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    }
  };

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
        
        // Fetch stats
        fetchStats(data.user.id);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [username, fetchStats]);

  useEffect(() => {
    if (user && currentUser && !isCurrentUserLoading) {
      checkFollowStatus(parseInt(user.id), parseInt(currentUser.id));
    }
  }, [user, currentUser, isCurrentUserLoading, checkFollowStatus]);

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

  const isOwnProfile = currentUser && currentUser.id === user?.id;
  const profileAvatar = isOwnProfile ? (currentUser.avatar_url || user.avatar_url) : user.avatar_url;
  const profileName = isOwnProfile ? currentUser.display_name : user.display_name;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 relative">
      {currentUser && currentUser.id === user.id && (
        <div className="absolute top-4 right-4 z-10">
          <Button 
            onClick={() => router.push('/settings')}
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-full bg-background/50 backdrop-blur shadow-sm border border-border/50 active:scale-90 transition-all"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      )}

      <div className="flex flex-col items-center text-center mb-16">
        <div className="relative mb-6">
          <Avatar className="h-28 w-28 ring-4 ring-primary/10 shadow-2xl">
            <AvatarImage src={profileAvatar || '/avatars/default.png'} alt={profileName} className="object-cover" />
            <AvatarFallback className="bg-primary/5 text-primary text-3xl font-bold">{profileName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg border-4 border-background">
             <div className="h-4 w-4 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase">Pro</span>
             </div>
          </div>
        </div>
        <h1 className="font-heading text-3xl font-black uppercase tracking-tight mb-2">{profileName}</h1>
        
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">@{user.username}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{mediaList.length} Posts</span>
        </div>

        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex flex-col items-center">
            <span className="font-black text-lg">{followersCount}</span>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-black text-lg">{followingCount}</span>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Following</span>
          </div>
        </div>

        {user.bio && (
          <p className="max-w-md text-sm text-muted-foreground mb-8 leading-relaxed">
            {user.bio}
          </p>
        )}

        {currentUser && currentUser.id === user.id && null /* Removed from here */}

        {currentUser && currentUser.id !== user.id && (
          <Button 
            onClick={handleFollow}
            variant={isFollowing ? "outline" : "default"}
            className="mb-6 rounded-full px-8 font-bold uppercase tracking-widest"
          >
            {isFollowing ? (
              <>
                <UserCheck className="mr-2 h-4 w-4" /> Following
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Follow
              </>
            )}
          </Button>
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

        <TabsContent value="all" className="mt-0">
          <MediaGrid mediaList={mediaList} />
        </TabsContent>
        <TabsContent value="photos" className="mt-0">
          <MediaGrid mediaList={photos} />
        </TabsContent>
        <TabsContent value="videos" className="mt-0">
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
    <div className="grid grid-cols-1 gap-4">
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
