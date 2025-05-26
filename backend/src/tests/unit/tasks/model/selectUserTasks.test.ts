import { selectUserTasks, insertUserTask } from '@/routes/tasks/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('selectUserTasks()', () => {
  let user: any;

  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('select_user', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'select_user'`
    );
    user = rows[0];
    conn.release();

    await insertUserTask(testConnection, {
      userId: user.id,
      contents: '선택 테스트 할 일',
      duration: 1,
    });
  });

  test('유저의 할 일 목록을 조회할 수 있어야 한다', async () => {
    const result = await selectUserTasks(testConnection, user.id);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('taskId');
    expect(result[0]).toHaveProperty('contents');
  });
});
