import pool from '../lib/db';
import { UserRepository, MediaRepository, CommentRepository } from '../lib/repositories';

async function seed() {
  console.log('🌱 Starting Database Seeding...');
  
  const userRepo = new UserRepository();
  const mediaRepo = new MediaRepository();
  const commentRepo = new CommentRepository();

  try {
    // 1. Seed a Mock User
    console.log('Seeding mock user...');
    const mockUser = {
      username: 'aurora_explorer',
      email: 'aurora@example.com',
      password_hash: '$2a$10$Xm5X6E7y6v6v6v6v6v6v6uXm5X6E7y6v6v6v6v6v6v6uXm5X6E7y', // Placeholder for 'Password123!'
      display_name: 'Aurora Explorer',
      avatar_url: '/avatars/default.png',
      bio: 'Exploring the world through a lens.'
    };

    let user = await userRepo.findByUsername(mockUser.username);
    if (!user) {
      user = await userRepo.create(mockUser);
      console.log(`✅ User created: ${user.username}`);
    }

    console.log('✨ Seeding Completed Successfully! ✨');
  } catch (error: any) {
    console.error('❌ Seeding Failed!');
    console.error(error);
  } finally {
    await pool.end();
  }
}

seed();
