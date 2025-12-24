import { NextResponse } from 'next/server';
import { MediaRepository } from '@/lib/repositories';

export async function GET() {
  try {
    const mediaRepo = new MediaRepository();
    const count = await mediaRepo.count(); // Assuming a count method exists or can be added
    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('API Error (Media Count):', error);
    return NextResponse.json({ error: 'Failed to fetch media count' }, { status: 500 });
  }
}