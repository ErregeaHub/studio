import { BaseRepository } from './base.repository';
import { query } from '../db';
import { UserInput, UserSchema } from '../validations';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  display_name: string;
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
    const results = await query<User[]>(
      `INSERT INTO ${this.tableName} (username, email, password_hash, display_name, avatar_url, bio, verification_token) 
       VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      [
        data.username,
        data.email,
        data.password_hash,
        data.display_name,
        data.avatar_url ?? null,
        data.bio ?? null,
        data.verification_token ?? null
      ]
    );

    if (results.length === 0) throw new Error('Failed to create user');
    return results[0];
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

  async findByVerificationToken(token: string): Promise<User | null> {
    const results = await query<User[]>(
      `SELECT * FROM ${this.tableName} WHERE verification_token = ?`,
      [token]
    );
    return results.length > 0 ? results[0] : null;
  }

  async update(id: number, data: Partial<UserInput & { is_verified?: boolean; verification_token?: string | null }>): Promise<User | null> {
    const fields = Object.keys(data);
    if (fields.length === 0) return this.findById(id);

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = Object.values(data);

    const results = await query<User[]>(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ? RETURNING *`,
      [...values, id]
    );

    return results.length > 0 ? results[0] : null;
  }

  async search(searchTerm: string): Promise<User[]> {
    const term = `%${searchTerm}%`;
    return await query<User[]>(
      `SELECT * FROM ${this.tableName} 
       WHERE username LIKE ? OR display_name LIKE ? 
       ORDER BY username ASC`,
      [term, term]
    );
  }
}
