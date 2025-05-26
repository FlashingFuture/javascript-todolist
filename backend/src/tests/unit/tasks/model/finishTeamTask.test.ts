import { finishTeamTask } from '@/routes/tasks/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('finishTeamTask()', () => {
  let userId: number;
  let teamId: number;
  let taskId: number;

  beforeEach(async () => {
    const conn = await testConnection.getConnection();

    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('user2', 'pw', 'salt')`
    );
    const [[user]] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM users WHERE name = 'user2'`
    );
    userId = user.id;

    await conn.query(`INSERT INTO teams (name, owner_id) VALUES ('team1', ?)`, [
      userId,
    ]);
    const [[team]] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM teams WHERE name = 'team1'`
    );
    teamId = team.id;

    await conn.query(
      `INSERT INTO team_members (team_id, user_id) VALUES (?, ?)`,
      [teamId, userId]
    );
    await conn.query(
      `INSERT INTO team_tasks (team_id, contents, due_date) VALUES (?, 'team task', NOW())`,
      [teamId]
    );
    const [[task]] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM team_tasks WHERE team_id = ?`,
      [teamId]
    );
    taskId = task.id;

    conn.release();
  });

  test('정상 완료 시 { teamId, taskId, isDone: true } 반환', async () => {
    const result = await finishTeamTask(testConnection, taskId, teamId);
    expect(result).toEqual({ teamId, taskId, isDone: true });
  });

  test('존재하지 않는 task일 경우 null 반환', async () => {
    const result = await finishTeamTask(testConnection, 9999, teamId);
    expect(result).toBeNull();
  });
});
