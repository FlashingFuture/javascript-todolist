import { testConnection } from '@/database/testDB';

export const resetTestDB = async () => {
  const conn = await testConnection.getConnection();
  try {
    await conn.query('DELETE FROM users');
    await conn.query('ALTER TABLE users AUTO_INCREMENT = 1');

    const [rows] = await conn.query('SELECT * FROM users');
    console.log('✅ 초기화 후 users 테이블 내용:', rows);
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};
