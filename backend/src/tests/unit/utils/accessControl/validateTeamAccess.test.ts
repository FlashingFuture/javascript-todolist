import { validateTeamAccess } from '@/utils/accessControl/strategies/validateTeamAccess';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('validateTeamAccess()', () => {
  let userId: number;
  let teamId: number;

  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('user1', 'pw', 'salt')`
    );
    const [user] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM users WHERE name = 'user1'`
    );
    userId = user[0].id;

    await conn.query(`INSERT INTO teams (name, owner_id) VALUES ('team1', ?)`, [
      userId,
    ]);
    const [team] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM teams WHERE name = 'team1'`
    );
    teamId = team[0].id;

    await conn.query(
      `INSERT INTO team_members (team_id, user_id) VALUES (?, ?)`,
      [teamId, userId]
    );
    conn.release();
  });

  test('유저가 팀에 속해있으면 true 반환', async () => {
    const result = await validateTeamAccess(testConnection, teamId, userId);
    expect(result).toBe(true);
  });

  test('유저가 팀에 속해있지 않으면 false 반환', async () => {
    const result = await validateTeamAccess(testConnection, teamId, 99999);
    expect(result).toBe(false);
  });
});
