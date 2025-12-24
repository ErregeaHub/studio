import { query } from '../db';
import { ResultSetHeader } from 'mysql2';

/**
 * Base Repository providing common CRUD utility methods
 */
export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  async findById(id: number): Promise<T | null> {
    const results = await query<T[]>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }

  async findAll(): Promise<T[]> {
    return await query<T[]>(`SELECT * FROM ${this.tableName}`);
  }

  async delete(id: number): Promise<boolean> {
    const result = await query<ResultSetHeader>(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}
