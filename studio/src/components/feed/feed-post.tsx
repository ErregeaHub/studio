'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { useEffect } from 'react';

interface FeedPostProps {
  post: {
    id: string;
    content: string;
    mediaUrl?: string;
    mediaType?: 'photo' | 'video';
    createdAt: Date;
    user: {
      name: string;
      handle: string;
      avatar: string;
    };
    likes: number;
    comments: number;
    isLiked?: boolean;
  };
}

export default function FeedPost({ post }: FeedPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load liked state from localStorage on mount
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
    if (likedPosts[post.id]) {
      setIsLiked(true);
    }
    
    // Fetch comments
    fetchComments();
  }, [post.id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/media/${post.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setCommentsList(data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to post a comment.",
        variant: "destructive"
      });
      return;
    }

    if (!comment.trim()) return;

    setIsSubmittingComment(true);
    const commentContent = comment.trim();
    
    // Optimistic Update
    const tempId = Date.now();
    const newComment = {
      id: tempId,
      content: commentContent,
      author_id: user.id,
      author_name: user.display_name,
      author_avatar: user.avatar_url,
      created_at: new Date().toISOString()
    };
    
    setCommentsList(prev => [...prev, newComment]);
    setComment('');

    try {
      const response = await fetch(`/api/media/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: commentContent,
          authorId: user.id
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      
      const savedComment = await response.json();
      // Replace temp comment with saved one
      setCommentsList(prev => prev.map(c => c.id === tempId ? savedComment : c));
    } catch (error) {
      console.error('Comment error:', error);
      // Revert optimistic update
      setCommentsList(prev => prev.filter(c => c.id !== tempId));
      setComment(commentContent);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLike = async () => {
    const newLikedState = !isLiked;
    const action = newLikedState ? 'like' : 'unlike';
    
    // Optimistic Update
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

    // Update localStorage
    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
    if (newLikedState) {
      likedPosts[post.id] = true;
    } else {
      delete likedPosts[post.id];
    }
    localStorage.setItem('liked_posts', JSON.stringify(likedPosts));

    try {
      const response = await fetch(`/api/media/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to toggle like');
      }
    } catch (error: any) {
      console.error('Like error:', error);
      // Revert Optimistic Update and localStorage on failure
      const revertedState = !newLikedState;
      setIsLiked(revertedState);
      setLikeCount(prev => revertedState ? prev + 1 : prev - 1);
      
      const currentLikedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
      if (revertedState) {
        currentLikedPosts[post.id] = true;
      } else {
        delete currentLikedPosts[post.id];
      }
      localStorage.setItem('liked_posts', JSON.stringify(currentLikedPosts));
      
      toast({
        title: "Error",
        description: error.message || "Failed to toggle like. Please try again.",
        variant: "destructive"
      });
    }
  };

  const truncateLimit = 150;
  const shouldTruncate = post.content.length > truncateLimit;
  const displayContent = isExpanded || !shouldTruncate 
    ? post.content 
    : post.content.slice(0, truncateLimit) + '...';

  return (
    <Card className="overflow-hidden border-none bg-background hover:bg-secondary/5 transition-colors rounded-none border-b border-border/50">
      <div className="flex gap-3 md:gap-4 p-3 md:p-4">
        {/* Avatar */}
        <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0 ring-2 ring-background shadow-sm">
          <AvatarImage src={post.user.avatar} alt={post.user.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs md:text-sm">{post.user.name[0]}</AvatarFallback>
        </Avatar>

        {/* Content Area */}
        <div className="flex flex-1 flex-col gap-2 md:gap-3 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2 overflow-hidden min-w-0">
              <span className="truncate font-bold text-[14px] md:text-[15px] text-foreground hover:underline cursor-pointer">
                {post.user.name}
              </span>
              <span className="truncate text-xs md:text-sm text-muted-foreground">@{post.user.handle}</span>
              <span className="text-muted-foreground hidden xs:inline">·</span>
              <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap hidden xs:inline">
                {formatDistanceToNow(post.createdAt)}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground rounded-full hover:bg-primary/10 hover:text-primary">
              <MoreHorizontal className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-1">
            <p className="text-[14px] md:text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
              {displayContent}
            </p>
            {shouldTruncate && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[10px] md:text-xs font-bold text-primary hover:underline self-start mt-1 uppercase tracking-wider font-action"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Media Container */}
          {post.mediaUrl && (
            <div className={cn(
              "relative mt-2 overflow-hidden rounded-2xl bg-secondary/30 ring-1 ring-border/50 w-full",
              post.mediaType === 'video' ? "aspect-video" : ""
            )}>
              {post.mediaType === 'video' ? (
                <video 
                  src={post.mediaUrl} 
                  controls 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="relative w-full">
                  <img 
                    src={post.mediaUrl} 
                    alt="Post media" 
                    className="w-full h-auto object-contain max-h-[600px] block mx-auto"
                  />
                </div>
              )}
            </div>
          )}

          {/* Interaction Bar */}
          <div className="mt-1 md:mt-2 flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <button 
                onClick={handleLike}
                className="group flex items-center gap-1.5 md:gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <div className={cn(
                  "flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full transition-colors group-hover:bg-primary/10",
                  isLiked && "text-primary"
                )}>
                  <Heart className={cn(
                    "h-[16px] w-[16px] md:h-[18px] md:w-[18px] transition-all",
                    isLiked && "fill-current scale-110 md:scale-125 animate-in zoom-in-75 duration-300"
                  )} />
                </div>
                <span className={cn("text-[11px] md:text-xs font-medium", isLiked && "text-primary")}>{likeCount}</span>
              </button>

              <button 
                onClick={() => setShowComments(!showComments)}
                className="group flex items-center gap-1.5 md:gap-2 text-muted-foreground transition-colors hover:text-blue-500"
              >
                <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full transition-colors group-hover:bg-blue-500/10">
                  <MessageCircle className={cn("h-[16px] w-[16px] md:h-[18px] md:w-[18px]", showComments && "text-blue-500 fill-blue-500/10")} />
                </div>
                <span className={cn("text-[11px] md:text-xs font-medium", showComments && "text-blue-500")}>{commentsList.length}</span>
              </button>

              <button className="group flex items-center gap-1.5 md:gap-2 text-muted-foreground transition-colors hover:text-green-500">
                <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full transition-colors group-hover:bg-green-500/10">
                  <Share2 className="h-[16px] w-[16px] md:h-[18px] md:w-[18px]" />
                </div>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-3 md:mt-4 space-y-3 md:space-y-4 border-t border-border/50 pt-3 md:pt-4">
              {commentsList.length > 0 ? (
                <div className="space-y-3 md:space-y-4 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
                  {commentsList.map((c) => (
                    <div key={c.id} className="flex gap-2 md:gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Avatar className="h-7 w-7 md:h-8 md:w-8 ring-1 ring-border/50">
                        <AvatarImage src={c.author_avatar} alt={c.author_name} />
                        <AvatarFallback className="text-[9px] md:text-[10px] bg-primary/5">{c.author_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 rounded-xl md:rounded-2xl bg-secondary/20 p-2 md:p-3 ring-1 ring-border/30">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] md:text-xs font-bold text-foreground">{c.author_name}</span>
                          <span className="text-[9px] md:text-[10px] text-muted-foreground">
                            {c.created_at ? formatDistanceToNow(new Date(c.created_at)) : 'just now'}
                          </span>
                        </div>
                        <p className="mt-0.5 md:mt-1 text-[13px] md:text-sm text-foreground/90 leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[10px] md:text-xs text-muted-foreground py-1 md:py-2 italic">No replies yet. Be the first to post!</p>
              )}
            </div>
          )}

          {/* Inline Comment Input */}
          <form 
            onSubmit={handleCommentSubmit}
            className="mt-3 md:mt-4 flex items-center gap-2 md:gap-3 bg-secondary/30 rounded-xl md:rounded-2xl px-2 md:px-3 py-1.5 md:py-2 ring-1 ring-inset ring-transparent focus-within:ring-primary/50 transition-all"
          >
            <Avatar className="h-6 w-6 md:h-7 md:w-7 ring-1 ring-background">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="text-[9px] md:text-[10px] font-bold bg-primary/10">{user?.display_name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <input 
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Post your reply"
              className="flex-1 bg-transparent text-[13px] md:text-sm outline-none placeholder:text-muted-foreground"
              disabled={isSubmittingComment}
            />
            <Button 
              type="submit"
              size="icon" 
              variant="ghost" 
              className={cn(
                "h-7 w-7 md:h-8 md:w-8 rounded-full transition-all",
                comment.trim() ? "text-primary hover:bg-primary/10 scale-105 md:scale-110" : "text-muted-foreground/30 cursor-not-allowed"
              )}
              disabled={!comment.trim() || isSubmittingComment}
            >
              <Send className={cn("h-3.5 w-3.5 md:h-4 md:w-4", isSubmittingComment && "animate-pulse")} />
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
}
