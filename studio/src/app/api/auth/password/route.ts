import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/repositories';
import { ChangePasswordSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, currentPassword, newPassword } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Validate passwords with Zod
    ChangePasswordSchema.parse({ currentPassword, newPassword, confirmPassword: body.confirmPassword });

    const userRepo = new UserRepository();
    const user = await userRepo.findById(parseInt(id));

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await userRepo.update(user.id, {
      password_hash: hashedPassword as any // Type cast because UserInput doesn't include password_hash
    });

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('API Error (Change Password):', error);
    
    // Handle Zod validation errors
    if (error instanceof ZodError || error.name === 'ZodError' || error.issues) {
      return NextResponse.json({ 
        error: error.errors ? error.errors[0].message : (error.issues ? error.issues[0].message : 'Validation error')
      }, { status: 400 });
    }

    return NextResponse.json({ error: error.message || 'Failed to change password' }, { status: 500 });
  }
}
