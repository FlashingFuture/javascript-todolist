import {
  insertTeamMember,
  insertTeam,
  selectMembersByTeamId,
} from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('insertTeamMember()', () => {
  test('팀에 멤버를 추가할 수 있어야 한다', async () => {
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
    await insertTeamMember(testConnection, team.id, user.id);

    const members = await selectMembersByTeamId(testConnection, team.id);
    expect(members.some((m) => m.id === user.id)).toBe(true);
  });

  test('존재하지 않는 유저나 팀에 멤버 추가 시 ForeignKey 에러가 발생해야 한다', async () => {
    await expect(
      insertTeamMember(testConnection, 99999, 88888)
    ).rejects.toThrow(/foreign key/i);
  });
});
