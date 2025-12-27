import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/repositories';
import { SignupSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { isRateLimited } from '@/lib/rate-limit';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // 0. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    if (isRateLimited(`signup_${ip}`, 5, 60000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();

    // 1. Validate Input & Sanitize (Zod handles basic types)
    const validatedData = SignupSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    let { username, email, password, display_name } = validatedData.data;

    // Simple sanitization
    username = username.trim().toLowerCase();
    email = email.trim().toLowerCase();
    display_name = display_name.trim();

    const userRepo = new UserRepository();

    // 2. Check for Duplicates
    const existingUsername = await userRepo.findByUsername(username);
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const existingEmail = await userRepo.findByEmail(email);
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 4. Generate Verification Token
    const verification_token = uuidv4();

    // --- Supabase User Creation ---
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    // We sign up with Supabase first. 
    // If you have "Confirm Email" enabled in Supabase, this will send its own email.
    const { data: sbData, error: sbError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name,
        }
      }
    });

    if (sbError) {
      console.error('Supabase Signup Error:', sbError);
      return NextResponse.json({ error: sbError.message }, { status: 400 });
    }
    // ------------------------------

    // 5. Create User in local DB
    const newUser = await userRepo.create({
      username,
      email,
      password_hash,
      display_name,
      verification_token
    });

    // 6. Send Verification Email
    await sendVerificationEmail(email, verification_token);

    // 7. Success Response
    return NextResponse.json({
      message: 'User registered successfully. Please check your email for verification.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        display_name: newUser.display_name
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
