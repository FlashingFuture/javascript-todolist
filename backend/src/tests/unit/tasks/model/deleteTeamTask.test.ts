import { insertTeamTask, deleteTeamTask } from '@/routes/tasks/model';
import { insertTeam } from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('deleteTeamTask()', () => {
  let team: any;
  let taskId: number;

  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('delete_team_user', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'delete_team_user'`
    );
    const user = rows[0];
    conn.release();

    team = await insertTeam(testConnection, 'DeleteTeam', user.id);
    const task = await insertTeamTask(testConnection, {
      teamId: team.id,
      contents: '삭제할 팀 할 일',
      duration: 1,
    });
    taskId = task.id;
  });

  test('팀의 할 일을 삭제할 수 있어야 한다', async () => {
    const deleted = await deleteTeamTask(testConnection, taskId, team.id);
    expect(deleted).toBe(true);
  });
});
