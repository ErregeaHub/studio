import { NextResponse } from 'next/server';
import { MediaRepository } from '@/lib/repositories';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const body = await request.json().catch(() => ({}));
    const { action } = body;
    
    const mediaRepo = new MediaRepository();
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    if (action === 'unlike') {
      await mediaRepo.decrementLikes(id);
    } else {
      await mediaRepo.incrementLikes(id);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error (Like Media):', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
