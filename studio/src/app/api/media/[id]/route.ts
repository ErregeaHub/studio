import { NextResponse } from 'next/server';
import { MediaRepository } from '@/lib/repositories';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const mediaRepo = new MediaRepository();
    const id = parseInt(idStr);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const media = await mediaRepo.findByIdWithDetails(id);
    
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Increment views asynchronously
    mediaRepo.incrementViews(id).catch(console.error);

    return NextResponse.json(media);
  } catch (error: any) {
    console.error('API Error (Media Detail):', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
