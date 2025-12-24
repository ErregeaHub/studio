import { NextResponse } from 'next/server';
import { CommentRepository } from '@/lib/repositories';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentRepo = new CommentRepository();
    const mediaId = parseInt(id);
    
    if (isNaN(mediaId)) {
      return NextResponse.json({ error: 'Invalid Media ID' }, { status: 400 });
    }

    const comments = await commentRepo.findByMedia(mediaId);
    return NextResponse.json(comments);
  } catch (error: any) {
    console.error('API Error (Comments List):', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { content, author_id } = body;
    const commentRepo = new CommentRepository();
    const mediaId = parseInt(id);

    if (isNaN(mediaId)) {
      return NextResponse.json({ error: 'Invalid Media ID' }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (!author_id) {
      return NextResponse.json({ error: 'Author ID is required' }, { status: 400 });
    }

    const newComment = await commentRepo.create({
      content,
      media_id: mediaId,
      author_id
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    console.error('API Error (Create Comment):', error);
    return NextResponse.json({ error: error.message || 'Failed to post comment' }, { status: 400 });
  }
}
