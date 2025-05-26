import { selectTeamTasks, insertTeamTask } from '@/routes/tasks/model';
import { insertTeam } from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('selectTeamTasks()', () => {
  let team: { id: number; name: string };

  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('team_reader', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'team_reader'`
    );
    const user = rows[0];
    conn.release();

    team = await insertTeam(testConnection, 'ReadTeam', user.id);

    await insertTeamTask(testConnection, {
      teamId: team.id,
      contents: '조회용 팀 할 일',
      duration: 2,
    });
  });

  test('팀의 할 일 목록을 조회할 수 있어야 한다', async () => {
    const result = await selectTeamTasks(testConnection, team.id);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('taskId');
    expect(result[0]).toHaveProperty('contents');
  });
});
