import { selectTeamById, insertTeam } from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('selectTeamById()', () => {
  test('팀 ID로 팀 정보를 반환해야 한다', async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('user1', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'user1'`
    );
    const user = rows[0];
    conn.release();

    const team = await insertTeam(testConnection, 'Team1', user.id);
    const result = await selectTeamById(testConnection, team.id);

    expect(result.name).toBe('Team1');
  });

  test('존재하지 않는 팀 ID 조회 시 undefined를 반환해야 한다', async () => {
    const result = await selectTeamById(testConnection, 99999);
    expect(result).toBeUndefined();
  });
});
