'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, MessageCircle, Clock, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
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
  const { user, isLoading: isUserLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [commentText, setCommentText] = useState('');
  const [media, setMedia] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [mediaRes, commentsRes] = await Promise.all([
          fetch(`/api/media/${id}`),
          fetch(`/api/media/${id}/comments`)
        ]);

        if (mediaRes.status === 404) {
          setMedia(null);
        } else {
          const mediaData = await mediaRes.json();
          setMedia(mediaData);
        }

        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Failed to fetch media detail:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return <div className="container mx-auto max-w-6xl py-20 text-center">Loading...</div>;
  }

  if (!media) {
    notFound();
  }

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

  const handleCommentSubmit = async () => {
    if (!user) {
       toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to comment.',
      });
      return;
    }
    if (!commentText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Comment',
        description: 'You cannot post an empty comment.',
      });
      return;
    }

    try {
      const response = await fetch(`/api/media/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText })
      });
      
      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [...prev, {
          ...newComment,
          author_name: user.display_name,
          author_avatar: user.avatar_url
        }]);
        setCommentText('');
        toast({
          title: 'Comment Posted!',
          description: 'Your comment has been submitted.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to post comment.',
      });
    }
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
    return (
        <Image
          src={media.media_url}
          alt={media.title}
          fill
          className="object-contain"
        />
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-none bg-black ring-1 ring-border/50">
            <div className="relative aspect-video w-full">
              {renderMedia()}
            </div>
          </Card>
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="capitalize px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider">{media.type}</Badge>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{formatDistanceToNow(new Date(media.created_at), { addSuffix: true })}</span>
            </div>
            <h1 className="font-heading text-2xl md:text-4xl font-black uppercase tracking-tight">{media.title}</h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">{media.description}</p>
            
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
                <Button variant="default" size="sm" className="rounded-full font-bold uppercase tracking-wider text-[10px] px-4" onClick={() => {
                  toast({
                    title: "Following",
                    description: `You are now following ${media.display_name}.`,
                  });
                }}>Follow</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h3 className="font-heading text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Comments <span className="text-muted-foreground">({comments?.length ?? 0})</span>
            </h3>
            
            <div className="flex flex-col gap-6">
              {isUserLoading ? (
                 <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-border/50 bg-secondary/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading comments...</p>
                 </div>
              ) : user ? (
                <div className="flex gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea 
                      placeholder="Add a comment..." 
                      className="min-h-[100px] resize-none rounded-xl border-border/50 bg-secondary/20 focus-visible:ring-primary/20"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button onClick={handleCommentSubmit} className="w-full rounded-full font-bold uppercase tracking-widest text-xs">Post Comment</Button>
                  </div>
                </div>
              ) : (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-secondary/10 p-4 text-center hover:border-primary/50 transition-colors group">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">You must be logged in to comment.</p>
                          <Button variant="link" className="text-primary font-black uppercase tracking-widest text-[10px]">Log In or Sign Up</Button>
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-heading uppercase tracking-tight font-black">Authentication Required</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          Join the conversation! You need to be logged in to post a comment.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full font-bold uppercase tracking-widest text-[10px]">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.push('/login')} className="rounded-full font-bold uppercase tracking-widest text-[10px]">
                          Log In
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              )}
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author_avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">{comment.author_name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-secondary/10 rounded-2xl p-3 ring-1 ring-border/5 transition-all group-hover:ring-primary/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{comment.author_name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-xs font-bold uppercase tracking-widest text-muted-foreground">No comments yet. Be the first!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
