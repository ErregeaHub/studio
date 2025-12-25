import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/repositories';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userRepo = new UserRepository();

    const updatedUser = await userRepo.update(parseInt(id), {
      display_name: body.display_name,
      username: body.username,
      bio: body.bio
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('API Error (Update User):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
