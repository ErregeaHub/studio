'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Send, MessageCircle } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  author_id: number;
  author_name: string;
  author_avatar: string;
}

interface CommentSectionProps {
  mediaId: number;
}

export default function CommentSection({ mediaId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [mediaId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/media/${mediaId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/media/${mediaId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: user.id, content: newComment })
      });

      if (res.ok) {
        const comment = await res.json();
        // Optimistic update or wait for server response (already waiting)
        // Ensure the new comment has the author details (server should return them or we construct them)
        // The repository create method returns the comment with details, so we are good.
        setComments(prev => [...prev, comment]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-lg">Comments ({comments.length})</h3>
      </div>

      <ScrollArea className="flex-1 pr-4 -mr-4 mb-4 h-[300px]">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={comment.author_avatar || ''} />
                  <AvatarFallback>{comment.author_name?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{comment.author_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || ''} />
            <AvatarFallback>{user.display_name?.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[80px] resize-none pr-12"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute bottom-2 right-2 h-8 w-8" 
              disabled={!newComment.trim() || isSubmitting}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-secondary/20 rounded-lg text-center text-sm text-muted-foreground">
          Please log in to comment.
        </div>
      )}
    </div>
  );
}
