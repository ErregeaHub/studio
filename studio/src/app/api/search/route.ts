import { NextResponse } from 'next/server';
import { UserRepository, MediaRepository } from '@/lib/repositories';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const userRepo = new UserRepository();
    const mediaRepo = new MediaRepository();

    const [users, posts] = await Promise.all([
      userRepo.search(q),
      mediaRepo.searchWithDetails(q)
    ]);

    // Combine and format results
    const results = [
      ...users.map(u => ({
        type: 'user',
        id: u.id,
        username: u.username,
        display_name: u.display_name,
        avatar_url: u.avatar_url,
        bio: u.bio
      })),
      ...posts.map(p => ({
        type: 'post',
        ...p,
        content: p.description || p.title || ''
      }))
    ];

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
