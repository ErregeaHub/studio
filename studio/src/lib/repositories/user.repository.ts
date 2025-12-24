import { BaseRepository } from './base.repository';
import { query } from '../db';
import { UserInput, UserSchema } from '../validations';
import { ResultSetHeader } from 'mysql2';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  avatar_url?: string;
  bio?: string;
  is_verified: boolean;
  verification_token?: string;
  created_at: Date;
  updated_at: Date;
}

export class UserRepository extends BaseRepository<User> {
  protected tableName = 'user_accounts';

  async create(data: Omit<UserInput, 'password'> & { password_hash: string; verification_token?: string }): Promise<User> {
    const result = await query<ResultSetHeader>(
      `INSERT INTO ${this.tableName} (username, email, password_hash, display_name, first_name, last_name, phone_number, avatar_url, bio, verification_token) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.username,
        data.email,
        data.password_hash,
        data.display_name,
        data.first_name ?? null,
        data.last_name ?? null,
        data.phone_number ?? null,
        data.avatar_url ?? null,
        data.bio ?? null,
        data.verification_token ?? null
      ]
    );

    const newUser = await this.findById(result.insertId);
    if (!newUser) throw new Error('Failed to create user');
    return newUser;
  }

  async findByUsername(username: string): Promise<User | null> {
    const results = await query<User[]>(
      `SELECT * FROM ${this.tableName} WHERE username = ?`,
      [username]
    );
    return results.length > 0 ? results[0] : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const results = await query<User[]>(
      `SELECT * FROM ${this.tableName} WHERE email = ?`,
      [email]
    );
    return results.length > 0 ? results[0] : null;
  }

  async update(id: number, data: Partial<UserInput>): Promise<User | null> {
    const fields = Object.keys(data);
    if (fields.length === 0) return this.findById(id);

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = Object.values(data);

    await query<ResultSetHeader>(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  }
}
