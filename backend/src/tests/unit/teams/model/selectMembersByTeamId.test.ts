import { selectMembersByTeamId, insertTeam } from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('selectMembersByTeamId()', () => {
  test('팀 ID로 팀 멤버 목록을 반환해야 한다', async () => {
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
    const result = await selectMembersByTeamId(testConnection, team.id);

    expect(result.some((member) => member.name === 'user1')).toBe(true);
  });

  test('존재하지 않는 팀 ID 조회 시 빈 배열 반환해야 한다', async () => {
    const result = await selectMembersByTeamId(testConnection, 99999);
    expect(result).toEqual([]);
  });
});
