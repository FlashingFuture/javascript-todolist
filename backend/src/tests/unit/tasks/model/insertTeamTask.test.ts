import { insertTeamTask } from '@/routes/tasks/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';
import { insertTeam } from '@/routes/teams/model';

describe('insertTeamTask()', () => {
  let team: { id: number; name: string };

  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('team_owner', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'team_owner'`
    );
    const user = rows[0];
    conn.release();

    team = await insertTeam(testConnection, 'TeamTest', user.id);
  });

  test('팀 할 일을 추가할 수 있어야 한다', async () => {
    const result = await insertTeamTask(testConnection, {
      teamId: team.id,
      contents: '팀 할 일 테스트',
      duration: 5,
    });

    expect(result).toHaveProperty('id');
    expect(result.contents).toBe('팀 할 일 테스트');
    expect(result.teamId).toBe(team.id);
  });
});
