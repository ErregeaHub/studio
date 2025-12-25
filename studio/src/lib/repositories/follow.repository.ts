import { BaseRepository } from './base.repository';
import { query } from '../db';

export interface Follow {
  follower_id: number;
  following_id: number;
  created_at: Date;
}

export class FollowRepository extends BaseRepository<Follow> {
  protected tableName = 'follows';

  async follow(followerId: number, followingId: number): Promise<void> {
    await query(
      `INSERT INTO ${this.tableName} (follower_id, following_id) 
       VALUES (?, ?) 
       ON CONFLICT (follower_id, following_id) DO NOTHING`,
      [followerId, followingId]
    );
  }

  async unfollow(followerId: number, followingId: number): Promise<void> {
    await query(
      `DELETE FROM ${this.tableName} WHERE follower_id = ? AND following_id = ?`,
      [followerId, followingId]
    );
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const results = await query<Follow[]>(
      `SELECT * FROM ${this.tableName} WHERE follower_id = ? AND following_id = ?`,
      [followerId, followingId]
    );
    return results.length > 0;
  }

  async getFollowersCount(userId: number): Promise<number> {
    const results = await query<{ count: string }[]>(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE following_id = ?`,
      [userId]
    );
    return parseInt(results[0].count);
  }

  async getFollowingCount(userId: number): Promise<number> {
    const results = await query<{ count: string }[]>(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE follower_id = ?`,
      [userId]
    );
    return parseInt(results[0].count);
  }

  async getFollowers(userId: number): Promise<any[]> {
    return await query<any[]>(
      `SELECT u.id, u.username, u.display_name, u.avatar_url
       FROM ${this.tableName} f
       JOIN user_accounts u ON f.follower_id = u.id
       WHERE f.following_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );
  }

  async getFollowing(userId: number): Promise<any[]> {
    return await query<any[]>(
      `SELECT u.id, u.username, u.display_name, u.avatar_url
       FROM ${this.tableName} f
       JOIN user_accounts u ON f.following_id = u.id
       WHERE f.follower_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );
  }
}
