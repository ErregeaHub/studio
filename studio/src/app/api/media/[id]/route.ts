import { NextResponse, NextRequest } from 'next/server';
import { MediaRepository } from '@/lib/repositories/media.repository';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const mediaRepo = new MediaRepository();
    const media = await mediaRepo.findByIdWithDetails(parseInt(id));

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json(media);
  } catch (error: any) {
    console.error('API Error (Get Media by ID):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const mediaRepo = new MediaRepository();
    const deleted = await mediaRepo.deleteMedia(id, 'some_user_id'); // Placeholder for user ID

    if (!deleted) {
      return NextResponse.json({ error: 'Media not found or user not authorized to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error: any) {
    console.error('API Error (Delete Media):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
