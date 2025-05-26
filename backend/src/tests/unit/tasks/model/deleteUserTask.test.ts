import { insertUserTask, deleteUserTask } from '@/routes/tasks/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('deleteUserTask()', () => {
  let user: any;
  let taskId: number;

  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('delete_user', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'delete_user'`
    );
    user = rows[0];
    conn.release();

    const task = await insertUserTask(testConnection, {
      userId: user.id,
      contents: '삭제 테스트 할 일',
      duration: 1,
    });
    taskId = task.id;
  });

  test('사용자의 할 일을 삭제할 수 있어야 한다', async () => {
    const deleted = await deleteUserTask(testConnection, taskId, user.id);
    expect(deleted).toBe(true);
  });
});
