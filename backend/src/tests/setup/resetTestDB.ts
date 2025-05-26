import { testConnection } from '@/database/testDB';

export const resetTestDB = async () => {
  const conn = await testConnection.getConnection();
  try {
    await conn.query('DELETE FROM team_members');
    await conn.query('DELETE FROM team_tasks');
    await conn.query('DELETE FROM user_tasks');
    await conn.query('DELETE FROM teams');
    await conn.query('DELETE FROM users');

    await conn.query('ALTER TABLE team_members AUTO_INCREMENT = 1');
    await conn.query('ALTER TABLE team_tasks AUTO_INCREMENT = 1');
    await conn.query('ALTER TABLE user_tasks AUTO_INCREMENT = 1');
    await conn.query('ALTER TABLE teams AUTO_INCREMENT = 1');
    await conn.query('ALTER TABLE users AUTO_INCREMENT = 1');
  } catch (err) {
    console.error('DB 초기화 중 에러:', err);
  } finally {
    conn.release();
  }
};
