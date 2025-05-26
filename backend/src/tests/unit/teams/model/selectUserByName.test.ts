import { selectUserByName } from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('selectUserByName()', () => {
  test('유저 이름으로 유저 정보를 반환해야 한다', async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('user1', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'user1'`
    );
    const user = rows[0];
    conn.release();

    const result = await selectUserByName(testConnection, 'user1');
    expect(result.id).toBe(user.id);
  });
});
