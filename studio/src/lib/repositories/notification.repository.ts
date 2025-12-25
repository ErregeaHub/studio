import { BaseRepository } from './base.repository';
import { query } from '../db';

export interface Notification {
  id: number;
  recipient_id: number;
  actor_id: number;
  type: 'follow' | 'comment' | 'like';
  reference_id?: number;
  is_read: boolean;
  created_at: Date;
}

export class NotificationRepository extends BaseRepository<Notification> {
  protected tableName = 'notifications';

  async create(data: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<Notification> {
    const results = await query<Notification[]>(
      `INSERT INTO ${this.tableName} (recipient_id, actor_id, type, reference_id) 
       VALUES (?, ?, ?, ?) RETURNING *`,
      [data.recipient_id, data.actor_id, data.type, data.reference_id || null]
    );
    
    if (results.length === 0) throw new Error('Failed to create notification');
    return results[0];
  }

  async findByRecipient(recipientId: number): Promise<any[]> {
    return await query<any[]>(
      `SELECT n.*, u.username as actor_name, u.avatar_url as actor_avatar
       FROM ${this.tableName} n
       JOIN user_accounts u ON n.actor_id = u.id
       WHERE n.recipient_id = ?
       ORDER BY n.created_at DESC`,
      [recipientId]
    );
  }

  async markAsRead(id: number): Promise<void> {
    await query(
      `UPDATE ${this.tableName} SET is_read = TRUE WHERE id = ?`,
      [id]
    );
  }

  async markAllAsRead(recipientId: number): Promise<void> {
    await query(
      `UPDATE ${this.tableName} SET is_read = TRUE WHERE recipient_id = ?`,
      [recipientId]
    );
  }

  async getUnreadCount(recipientId: number): Promise<number> {
    const results = await query<{ count: string }[]>(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE recipient_id = ? AND is_read = FALSE`,
      [recipientId]
    );
    return parseInt(results[0].count);
  }
}
