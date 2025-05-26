import {
  selectTeamMemberById,
  insertTeam,
  insertTeamMember,
} from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('selectTeamMemberById()', () => {
  let user: any;
  let team: { id: number; name: string };

  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('user1', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'user1'`
    );
    user = rows[0];
    conn.release();

    team = await insertTeam(testConnection, 'TestTeam', user.id);
  });

  test('팀에 속한 유저를 조회할 수 있어야 한다', async () => {
    // 이미 insertTeam 시 팀장으로 들어가므로 바로 조회 가능
    const result = await selectTeamMemberById(testConnection, team.id, user.id);

    expect(result).toBeDefined();
    expect(result.id).toBe(user.id);
    expect(result.name).toBe(user.name);
  });

  test('팀에 속하지 않은 유저는 undefined를 반환해야 한다', async () => {
    // 새로운 유저 추가 (team에는 속하지 않음)
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('user2', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'user2'`
    );
    const outsider = rows[0];
    conn.release();

    const result = await selectTeamMemberById(
      testConnection,
      team.id,
      outsider.id
    );
    expect(result).toBeUndefined();
  });
});
