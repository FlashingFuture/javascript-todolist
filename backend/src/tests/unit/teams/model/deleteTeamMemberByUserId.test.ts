import {
  deleteTeamMemberByUserId,
  insertTeam,
  selectMembersByTeamId,
} from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('deleteTeamMemberByUserId()', () => {
  test('팀에서 멤버를 삭제할 수 있어야 한다', async () => {
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
    await deleteTeamMemberByUserId(testConnection, team.id, user.id);

    const members = await selectMembersByTeamId(testConnection, team.id);
    expect(members.some((m) => m.id === user.id)).toBe(false);
  });

  test('존재하지 않는 멤버 삭제 시 에러 없이 통과해야 한다', async () => {
    await expect(
      deleteTeamMemberByUserId(testConnection, 123, 456)
    ).resolves.not.toThrow();
  });
});
