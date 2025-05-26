import { updateUserTask } from '@/routes/tasks/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('updateUserTask()', () => {
  let userId: number;
  let taskId: number;

  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('user1', 'pw', 'salt')`
    );
    const [userRows] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM users WHERE name = 'user1'`
    );
    userId = userRows[0].id;

    await conn.query(
      `INSERT INTO user_tasks (user_id, contents, due_date) VALUES (?, 'old content', NOW())`,
      [userId]
    );
    const [taskRows] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM user_tasks WHERE user_id = ?`,
      [userId]
    );
    taskId = taskRows[0].id;
    conn.release();
  });

  test('정상적으로 업데이트되면 변경된 task 반환', async () => {
    const result = await updateUserTask(testConnection, {
      taskId,
      contents: 'updated content',
      duration: 3,
      userId,
    });

    expect(result).not.toBeNull();
    expect(result!.contents).toBe('updated content');
    expect(result!.isDone).toBe(0);
  });

  test('존재하지 않는 taskId는 null 반환', async () => {
    const result = await updateUserTask(testConnection, {
      taskId: 99999,
      contents: 'updated content',
      duration: 3,
      userId,
    });
    expect(result).toBeNull();
  });
});
