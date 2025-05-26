import { updateTeamTask } from '@/routes/tasks/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('updateTeamTask()', () => {
  let userId: number;
  let teamId: number;
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

    await conn.query(`INSERT INTO teams (name, owner_id) VALUES ('team1', ?)`, [
      userId,
    ]);
    const [teamRows] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM teams WHERE name = 'team1'`
    );
    teamId = teamRows[0].id;

    await conn.query(
      `INSERT INTO team_members (team_id, user_id) VALUES (?, ?)`,
      [teamId, userId]
    );

    await conn.query(
      `INSERT INTO team_tasks (team_id, contents, due_date) VALUES (?, 'old team content', NOW())`,
      [teamId]
    );
    const [taskRows] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM team_tasks WHERE team_id = ?`,
      [teamId]
    );
    taskId = taskRows[0].id;

    conn.release();
  });

  test('정상적으로 팀 task가 업데이트되면 결과 반환', async () => {
    const result = await updateTeamTask(testConnection, {
      taskId,
      contents: 'updated team content',
      duration: 5,
      teamId,
    });

    expect(result).not.toBeNull();
    expect(result!.contents).toBe('updated team content');
    expect(result!.isDone).toBe(0);
  });

  test('존재하지 않는 taskId는 null 반환', async () => {
    const result = await updateTeamTask(testConnection, {
      taskId: 99999,
      contents: 'fail case',
      duration: 1,
      teamId,
    });
    expect(result).toBeNull();
  });
});
