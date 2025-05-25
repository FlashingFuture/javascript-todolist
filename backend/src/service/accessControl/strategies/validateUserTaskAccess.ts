import { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

export const validateUserTaskAccess = async (
  db: Pool,
  taskId: number,
  userId: number
): Promise<boolean> => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT 1 FROM user_tasks WHERE id = ? AND user_id = ? LIMIT 1`,
      [taskId, userId]
    );
    return rows.length > 0;
  } finally {
    conn.release();
  }
};
