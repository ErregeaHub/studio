import { NextResponse } from 'next/server';
import { MediaRepository } from '@/lib/repositories';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    const mediaRepo = new MediaRepository();
    const results = await mediaRepo.searchWithDetails(query);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('API Error (Search):', error);
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}
