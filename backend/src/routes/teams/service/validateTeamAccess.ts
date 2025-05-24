import type { Pool } from 'mysql2/promise';
import { HTTPError } from '@/utils/httpError';

export const validateTeamAccess = async (
  db: Pool,
  teamId: number,
  userId: number
): Promise<void> => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query(
      `
      SELECT 1 FROM team_members
      WHERE team_id = ? AND user_id = ?
      LIMIT 1
      `,
      [teamId, userId]
    );

    if ((rows as any[]).length === 0) {
      throw new HTTPError(403, '해당 팀에 대한 접근 권한이 없습니다.');
    }
  } finally {
    conn.release();
  }
};
