import { BaseRepository } from './base.repository';
import { query } from '../db';
import { MediaContentInput, MediaContentSchema } from '../validations';

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

    const results = await query<MediaContent[]>(
      `INSERT INTO ${this.tableName} 
       (uploader_id, type, title, description, media_url, thumbnail_url) 
       VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
      [
        validatedData.uploader_id,
        validatedData.type,
        validatedData.title,
        validatedData.description ?? null,
        validatedData.media_url,
        validatedData.thumbnail_url
      ]
    );

    if (results.length === 0) throw new Error('Failed to create media content');
    return results[0];
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

  async count(): Promise<number> {
    const results = await query<{ count: string }[]>(`SELECT COUNT(*) as count FROM ${this.tableName}`);
    return parseInt(results[0].count);
  }

  async incrementViews(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET views_count = COALESCE(views_count, 0) + 1 WHERE id = ?`, [id]);
  }

  async findFollowingFeed(userId: number): Promise<any[]> {
    return await query<any[]>(
      `SELECT m.*, u.username, u.display_name, u.avatar_url
       FROM ${this.tableName} m
       JOIN user_accounts u ON m.uploader_id = u.id
       JOIN follows f ON f.following_id = u.id
       WHERE f.follower_id = ?
       ORDER BY m.created_at DESC`,
      [userId]
    );
  }

  async incrementLikes(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = ?`, [id]);
  }

  async decrementLikes(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) WHERE id = ?`, [id]);
  }

  async deleteMedia(id: number, uploaderId: number): Promise<boolean> {
    const result = await query<any>(
      `DELETE FROM ${this.tableName} WHERE id = ? AND uploader_id = ?`,
      [id, uploaderId]
    );
    return (result.rowCount || 0) > 0;
  }

  async findPaginated(
    cursor: string | null,
    limit: number = 10,
    sort: 'newest' | 'popular' | 'most-viewed' = 'newest'
  ): Promise<any[]> {
    let orderBy = 'm.created_at DESC, m.id DESC';
    let whereClause = '';
    const params: any[] = [];

    // Add cursor filter if provided
    if (cursor) {
      whereClause = 'WHERE m.id < ?';
      params.push(parseInt(cursor));
    }

    // Determine sort order
    switch (sort) {
      case 'popular':
        orderBy = 'm.likes_count DESC, m.id DESC';
        break;
      case 'most-viewed':
        orderBy = 'm.views_count DESC, m.id DESC';
        break;
      default:
        orderBy = 'm.created_at DESC, m.id DESC';
    }

    params.push(limit);

    return await query<any[]>(
      `SELECT m.*, u.username, u.display_name, u.avatar_url,
              COUNT(DISTINCT c.id) as comments_count
       FROM ${this.tableName} m
       LEFT JOIN user_accounts u ON m.uploader_id = u.id
       LEFT JOIN comments c ON c.media_id = m.id
       ${whereClause}
       GROUP BY m.id, u.id, u.username, u.display_name, u.avatar_url
       ORDER BY ${orderBy}
       LIMIT ?`,
      params
    );
  }

  async findFollowingPaginated(
    userId: number,
    cursor: string | null,
    limit: number = 10
  ): Promise<any[]> {
    const params: any[] = [userId];
    let whereClause = 'WHERE f.follower_id = ?';

    if (cursor) {
      whereClause += ' AND m.id < ?';
      params.push(parseInt(cursor));
    }

    params.push(limit);

    return await query<any[]>(
      `SELECT m.*, u.username, u.display_name, u.avatar_url,
              COUNT(DISTINCT c.id) as comments_count
       FROM ${this.tableName} m
       JOIN user_accounts u ON m.uploader_id = u.id
       JOIN follows f ON f.following_id = u.id
       LEFT JOIN comments c ON c.media_id = m.id
       ${whereClause}
       GROUP BY m.id, u.id, u.username, u.display_name, u.avatar_url
       ORDER BY m.created_at DESC, m.id DESC
       LIMIT ?`,
      params
    );
  }
}
