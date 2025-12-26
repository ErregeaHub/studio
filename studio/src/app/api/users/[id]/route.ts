import { NextResponse } from 'next/server';
import { UserRepository, MediaRepository } from '@/lib/repositories';
import { UserSchema } from '@/lib/validations';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userRepo = new UserRepository();
    const mediaRepo = new MediaRepository();

    let user = null;
    
    // Check if id is numeric
    if (/^\d+$/.test(id)) {
      user = await userRepo.findById(parseInt(id));
    } else {
      user = await userRepo.findByUsername(id);
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const media = await mediaRepo.findByUploaderWithDetails(user.id);

    return NextResponse.json({
      user,
      media
    });
  } catch (error: any) {
    console.error('API Error (User Profile):', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // PATCH only works with numeric ID for now for safety, or we find user first
    const userRepo = new UserRepository();
    let userId: number;

    if (/^\d+$/.test(id)) {
      userId = parseInt(id);
    } else {
      const user = await userRepo.findByUsername(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      userId = user.id;
    }

    const body = await request.json();

    // Validate input using UserSchema partial
    const validatedData = UserSchema.partial().safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedUser = await userRepo.update(userId, validatedData.data);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('API Error (Update User):', error);
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}
