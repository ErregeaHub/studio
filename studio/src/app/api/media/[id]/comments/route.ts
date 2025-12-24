import { NextResponse } from 'next/server';
import { CommentRepository, NotificationRepository, MediaRepository } from '@/lib/repositories';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: mediaIdStr } = await context.params;
    const mediaId = parseInt(mediaIdStr);

    if (isNaN(mediaId)) {
      return NextResponse.json({ error: 'Invalid Media ID' }, { status: 400 });
    }

    const commentRepo = new CommentRepository();
    const comments = await commentRepo.findByMedia(mediaId);

    return NextResponse.json(comments);
  } catch (error: any) {
    console.error('API Error (Get Comments):', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: mediaIdStr } = await context.params;
    const mediaId = parseInt(mediaIdStr);
    const body = await request.json();
    const { authorId, content } = body;

    if (isNaN(mediaId) || !authorId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const commentRepo = new CommentRepository();
    const newComment = await commentRepo.create({
      media_id: mediaId,
      author_id: parseInt(authorId),
      content
    });

    // Create Notification
    try {
      const mediaRepo = new MediaRepository();
      const media = await mediaRepo.findById(mediaId);
      
      if (media && media.uploader_id !== parseInt(authorId)) {
        const notifRepo = new NotificationRepository();
        await notifRepo.create({
          recipient_id: media.uploader_id,
          actor_id: parseInt(authorId),
          type: 'comment',
          reference_id: mediaId
        });
      }
    } catch (err) {
      console.error('Failed to create notification for comment:', err);
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    console.error('API Error (Create Comment):', error);
    return NextResponse.json({ error: error.message || 'Failed to create comment' }, { status: 500 });
  }
}
