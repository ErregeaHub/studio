import { BaseRepository } from './base.repository';
import { query } from '../db';
import { MediaContentInput, MediaContentSchema } from '../validations';
import { ResultSetHeader } from 'mysql2';

export interface MediaContent {
  id: number;
  uploader_id: number;
  type: 'photo' | 'video';
  title: string;
  description?: string;
  media_url: string;
  thumbnail_url: string;
  views_count: number;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
}

export class MediaRepository extends BaseRepository<MediaContent> {
  protected tableName = 'media_contents';

  async create(data: MediaContentInput): Promise<MediaContent> {
    const validatedData = MediaContentSchema.parse(data);
    
    const result = await query<ResultSetHeader>(
      `INSERT INTO ${this.tableName} 
       (uploader_id, type, title, description, media_url, thumbnail_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        validatedData.uploader_id,
        validatedData.type,
        validatedData.title,
        validatedData.description ?? null,
        validatedData.media_url,
        validatedData.thumbnail_url
      ]
    );

    const newMedia = await this.findById(result.insertId);
    if (!newMedia) throw new Error('Failed to create media content');
    return newMedia;
  }

  async findByUploader(uploaderId: number): Promise<MediaContent[]> {
    return await query<MediaContent[]>(
      `SELECT * FROM ${this.tableName} WHERE uploader_id = ? ORDER BY created_at DESC`,
      [uploaderId]
    );
  }

  async findByUploaderWithDetails(uploaderId: number): Promise<any[]> {
    return await query<any[]>(
      `SELECT m.*, u.username, u.display_name, u.avatar_url
       FROM ${this.tableName} m
       LEFT JOIN user_accounts u ON m.uploader_id = u.id
       WHERE m.uploader_id = ?
       ORDER BY m.created_at DESC`,
      [uploaderId]
    );
  }

  async searchWithDetails(searchTerm: string): Promise<any[]> {
    const term = `%${searchTerm}%`;
    return await query<any[]>(
      `SELECT m.*, u.username, u.display_name, u.avatar_url
       FROM ${this.tableName} m
       LEFT JOIN user_accounts u ON m.uploader_id = u.id
       WHERE m.title LIKE ? OR m.description LIKE ? OR u.username LIKE ? OR u.display_name LIKE ?
       ORDER BY m.created_at DESC`,
      [term, term, term, term]
    );
  }

  async findAllWithDetails(): Promise<any[]> {
    return await query<any[]>(
      `SELECT m.*, u.username, u.display_name, u.avatar_url
       FROM ${this.tableName} m
       LEFT JOIN user_accounts u ON m.uploader_id = u.id
       ORDER BY m.created_at DESC`
    );
  }

  async findByIdWithDetails(id: number): Promise<any | null> {
    const results = await query<any[]>(
      `SELECT m.*, u.username, u.display_name, u.avatar_url
       FROM ${this.tableName} m
       LEFT JOIN user_accounts u ON m.uploader_id = u.id
       WHERE m.id = ?`,
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }

  async incrementViews(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET views_count = views_count + 1 WHERE id = ?`, [id]);
  }

  async incrementLikes(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET likes_count = likes_count + 1 WHERE id = ?`, [id]);
  }

  async decrementLikes(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET likes_count = GREATEST(0, CAST(likes_count AS SIGNED) - 1) WHERE id = ?`, [id]);
  }
}
