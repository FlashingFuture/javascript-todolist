import { validateUserTaskAccess } from '@/utils/accessControl/strategies/validateUserTaskAccess';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('validateUserTaskAccess()', () => {
  let userId: number;
  let taskId: number;

  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('user1', 'pw', 'salt')`
    );
    const [user] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM users WHERE name = 'user1'`
    );
    userId = user[0].id;

    await conn.query(
      `INSERT INTO user_tasks (user_id, contents, due_date) VALUES (?, 'test task', NOW() + INTERVAL 1 DAY)`,
      [userId]
    );
    const [task] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM user_tasks WHERE user_id = ?`,
      [userId]
    );
    taskId = task[0].id;
    conn.release();
  });

  test('유저가 본인 작업에 접근 가능하면 true 반환', async () => {
    const result = await validateUserTaskAccess(testConnection, taskId, userId);
    expect(result).toBe(true);
  });

  test('유저가 다른 사람 작업에 접근하면 false 반환', async () => {
    const result = await validateUserTaskAccess(testConnection, taskId, 99999);
    expect(result).toBe(false);
  });
});
