import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { Pool } from 'mysql2/promise';

export const insertUser = async (
  db: Pool,
  user: {
    userId: string;
    password: string;
    salt: string;
  }
): Promise<{ id: number; userId: string }> => {
  const sql = 'INSERT INTO users (name, password, salt) VALUES (?, ?, ?)';
  const values = [user.userId, user.password, user.salt];

  const conn = await db.getConnection();
  try {
    const [result] = await conn.query<ResultSetHeader>(sql, values);
    return {
      id: result.insertId,
      userId: user.userId,
    };
  } finally {
    conn.release();
  }
};

export const selectUser = async (
  db: Pool,
  userId: string
): Promise<{ id: number; passwordHash: string; salt: string } | null> => {
  const sql = 'SELECT id, password, salt FROM users WHERE name = ?';
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(sql, [userId]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return null;
    }

    return {
      id: rows[0].id,
      passwordHash: rows[0].password,
      salt: rows[0].salt,
    };
  } finally {
    conn.release();
  }
};
