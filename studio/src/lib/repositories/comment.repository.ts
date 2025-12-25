import { BaseRepository } from './base.repository';
import { query } from '../db';
import { CommentInput, CommentSchema } from '../validations';

export interface Comment {
  id: number;
  media_id: number;
  author_id: number;
  content: string;
  created_at: Date;
}

export class CommentRepository extends BaseRepository<Comment> {
  protected tableName = 'comments';

  async findByIdWithDetails(id: number): Promise<any | null> {
    const results = await query<any[]>(
      `SELECT c.*, u.display_name as author_name, u.avatar_url as author_avatar 
       FROM ${this.tableName} c
       JOIN user_accounts u ON c.author_id = u.id
       WHERE c.id = ?`,
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }

  async create(data: CommentInput): Promise<any> {
    const validatedData = CommentSchema.parse(data);
    
    const results = await query<any[]>(
      `WITH inserted AS (
         INSERT INTO ${this.tableName} (media_id, author_id, content) 
         VALUES (?, ?, ?) 
         RETURNING *
       )
       SELECT i.*, u.display_name as author_name, u.avatar_url as author_avatar 
       FROM inserted i
       JOIN user_accounts u ON i.author_id = u.id`,
      [validatedData.media_id, validatedData.author_id, validatedData.content]
    );

    if (results.length === 0) throw new Error('Failed to create comment');
    return results[0];
  }

  async findByMedia(mediaId: number): Promise<Comment[]> {
    return await query<Comment[]>(
      `SELECT c.*, u.display_name as author_name, u.avatar_url as author_avatar 
       FROM ${this.tableName} c
       JOIN user_accounts u ON c.author_id = u.id
       WHERE c.media_id = ? 
       ORDER BY c.created_at ASC`,
      [mediaId]
    );
  }
}
