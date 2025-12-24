import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/repositories';
import { LoginSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = LoginSchema.parse(body);

    const userRepo = new UserRepository();
    const user = await userRepo.findByEmail(email);

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Exclude sensitive information like password_hash before returning
    const { password_hash, verification_token, ...userWithoutSensitiveData } = user;

    return NextResponse.json(userWithoutSensitiveData, { status: 200 });
  } catch (error: any) {
    console.error('API Error (Login):', error);
    return NextResponse.json({ error: error.message || 'Failed to login' }, { status: 400 });
  }
}
