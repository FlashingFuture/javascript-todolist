import type { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

export const validateTeamAccess = async (
  db: Pool,
  teamId: number,
  userId: number
): Promise<boolean> => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `
      SELECT 1 FROM team_members
      WHERE team_id = ? AND user_id = ?
      LIMIT 1
      `,
      [teamId, userId]
    );
    return rows.length > 0;
  } finally {
    conn.release();
  }
};
