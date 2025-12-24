import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/repositories';
import { UserSchema } from '@/lib/validations';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await context.params;
    const userId = parseInt(idStr);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    const body = await request.json();

    // Validate input using UserSchema (or a specific update schema)
    const validatedData = UserSchema.partial().safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const userRepo = new UserRepository();
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