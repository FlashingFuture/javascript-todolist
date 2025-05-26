import { finishUserTask } from '@/routes/tasks/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('finishUserTask()', () => {
  let userId: number;
  let taskId: number;

  beforeEach(async () => {
    const conn = await testConnection.getConnection();

    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('user1', 'pw', 'salt')`
    );
    const [[user]] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM users WHERE name = 'user1'`
    );
    userId = user.id;

    await conn.query(
      `INSERT INTO user_tasks (user_id, contents, due_date) VALUES (?, 'test task', NOW())`,
      [userId]
    );
    const [[task]] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM user_tasks WHERE user_id = ?`,
      [userId]
    );
    taskId = task.id;

    conn.release();
  });

  test('정상 완료 시 { taskId, isDone: true } 반환', async () => {
    const result = await finishUserTask(testConnection, taskId, userId);
    expect(result).toEqual({ taskId, isDone: true });
  });

  test('존재하지 않는 task일 경우 null 반환', async () => {
    const result = await finishUserTask(testConnection, 9999, userId);
    expect(result).toBeNull();
  });
});
