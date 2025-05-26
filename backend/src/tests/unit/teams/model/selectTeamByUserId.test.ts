import { selectTeamsByUserId, insertTeam } from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('selectTeamsByUserId()', () => {
  test('사용자가 속한 팀 목록을 반환해야 한다', async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('user1', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'user1'`
    );
    const user = rows[0];
    conn.release();

    await insertTeam(testConnection, 'Team1', user.id);

    const result = await selectTeamsByUserId(testConnection, user.id);
    expect(Array.isArray(result)).toBe(true);
  });
});
