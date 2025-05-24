import { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { HTTPError } from '@/utils/httpError';

export const validateTaskAccess = async (
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

    if ((rows as any[]).length === 0) {
      throw new HTTPError(403, '해당 일에 대한 접근 권한이 없습니다.');
    }
    return rows.length > 0;
  } finally {
    conn.release();
  }
};
