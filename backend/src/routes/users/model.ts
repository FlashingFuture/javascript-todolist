import { connection } from '@/database/mariadb';
import type { CreatedUser } from '@/types/user';
import type { ResultSetHeader } from 'mysql2';

export const createUser = async (user: {
  userId: string;
  password: string;
  salt: string;
}): Promise<CreatedUser> => {
  const sql = 'INSERT INTO users (name, password, salt) VALUES (?, ?, ?)';
  const values = [user.userId, user.password, user.salt];

  const conn = await connection.getConnection();
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
