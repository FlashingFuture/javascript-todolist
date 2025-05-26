import { insertUserTask } from '@/routes/tasks/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('insertUserTask()', () => {
  let user: RowDataPacket;

  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('user1', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'user1'`
    );
    user = rows[0];
    conn.release();
  });

  test('유저 개인 할 일을 등록할 수 있어야 한다', async () => {
    const result = await insertUserTask(testConnection, {
      userId: user.id,
      contents: '할 일 테스트',
      duration: 3,
    });

    expect(result).toHaveProperty('id');
    expect(result.contents).toBe('할 일 테스트');
  });
});
