'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Clock, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import CommentSection from '@/components/comment-section';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function MediaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [media, setMedia] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const mediaRes = await fetch(`/api/media/${id}`);
        
        if (mediaRes.status === 404) {
          setMedia(null);
        } else {
          const mediaData = await mediaRes.json();
          setMedia(mediaData);
        }
      } catch (error) {
        console.error('Failed to fetch media detail:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (user && media && media.uploader_id !== user.id) {
      checkFollowStatus();
    }
  }, [user, media]);

  const checkFollowStatus = async () => {
    if (!user || !media) return;
    try {
      const res = await fetch(`/api/users/${media.uploader_id}/follow?follower_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async () => {
    if (!user || !media) {
      toast({
        title: "Authentication Required",
        description: "Please log in to follow users.",
        variant: "destructive"
      });
      return;
    }

    setIsFollowLoading(true);
    try {
      const response = await fetch(`/api/users/${media.uploader_id}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: user.id })
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        toast({
          title: data.isFollowing ? "Followed" : "Unfollowed",
          description: data.isFollowing 
            ? `You are now following ${media.display_name}` 
            : `You unfollowed ${media.display_name}`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You need to be logged in to like content.",
      });
      return;
    }

    try {
      await fetch(`/api/media/${id}/like`, { method: 'POST' });
      setMedia((prev: any) => ({ ...prev, likes_count: prev.likes_count + 1 }));
      toast({
        title: 'Success!',
        description: `You liked "${media.title}".`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to like media.',
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied!',
      description: 'The link has been copied to your clipboard.',
    });
  };

  const handleDelete = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You need to be logged in to delete content.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Media deleted successfully.',
        });
        router.push(`/profile/${user.username}`); // Redirect to user's profile after deletion
      } else {
        const errorData = await response.json();
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorData.error || 'Failed to delete media.',
        });
      }
    } catch (error) {
      console.error('Failed to delete media:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete media.',
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto max-w-6xl py-20 text-center">Loading...</div>;
  }

  if (!media) {
    notFound();
  }

  const renderMedia = () => {
    if (media.type === 'video') {
      return (
        <video 
          src={media.media_url} 
          controls 
          className="h-full w-full object-contain"
        />
      );
    }
    if (media.type === 'photo') {
      return (
        <Image
          src={media.media_url}
          alt={media.title || 'Photo post'}
          fill
          className="object-contain"
        />
      );
    }
    return (
      <div className="flex items-center justify-center h-full p-8 text-center bg-secondary/10">
        <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-foreground/80">
          "{media.description}"
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10">
      <Breadcrumbs 
        items={[
          { label: 'Discover', href: '/discover' },
          { label: media.type === 'video' ? 'Videos' : media.type === 'photo' ? 'Photos' : 'Posts', href: media.type === 'video' ? '/videos' : media.type === 'photo' ? '/photos' : '/discover' },
          { label: media.title || 'Post' }
        ]}
        className="mb-6"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className={cn(
            "overflow-hidden border-none bg-black ring-1 ring-border/50",
            media.type === 'text' && "bg-background"
          )}>
            <div className={cn(
              "relative w-full",
              media.type === 'text' ? "min-h-[200px]" : "aspect-video"
            )}>
              {renderMedia()}
            </div>
          </Card>
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="capitalize px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider">{media.type}</Badge>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{formatDistanceToNow(new Date(media.created_at), { addSuffix: true })}</span>
            </div>
            {media.title && media.title !== 'Text Post' && (
              <h1 className="font-heading text-2xl md:text-4xl font-black uppercase tracking-tight">{media.title}</h1>
            )}
            {media.type !== 'text' && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">{media.description}</p>
            )}
            <div className="mt-8 flex items-center justify-between border-y border-border/50 py-4">
              <div className="flex items-center gap-2 md:gap-4">
                 <Button variant="ghost" size="sm" className="flex items-center gap-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" onClick={handleLike} disabled={!user}>
                  <Heart className={cn("h-5 w-5", media.likes_count > 0 && "fill-primary text-primary")} />
                  <span className="font-bold">{media.likes_count.toLocaleString()}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                  <span className="font-bold">Share</span>
                </Button>
                {user && media.uploader_id === user.id && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="flex items-center gap-2 rounded-full">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          media and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{(media.views_count || 0).toLocaleString()} Views</span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 bg-secondary/20 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Link href={`/profile/${media.username}`}>
                  <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                    <AvatarImage src={media.avatar_url || '/avatars/default.png'} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{media.display_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${media.username}`}
                    className="font-heading text-lg font-black uppercase tracking-tight hover:text-primary transition-colors block truncate"
                  >
                    {media.display_name}
                  </Link>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider truncate">@{media.username}</p>
                </div>
                {user && user.id !== media.uploader_id && (
                  <Button 
                    variant={isFollowing ? "secondary" : "default"} 
                    size="sm" 
                    className="rounded-full font-bold uppercase tracking-wider text-[10px] px-4" 
                    onClick={handleFollow}
                    disabled={isFollowLoading}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <CommentSection mediaId={parseInt(id)} />
          </div>
        </div>
      </div>
    </div>
  );
}
