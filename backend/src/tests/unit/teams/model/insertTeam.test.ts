import { insertTeam } from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';
import { RowDataPacket } from 'mysql2';

describe('insertTeam()', () => {
  test('팀 생성 시 팀 정보가 반환되고 팀장이 멤버로 추가되어야 함', async () => {
    const conn = await testConnection.getConnection();
    await conn.query(
      `INSERT INTO users (name, password, salt) VALUES ('owner1', 'pw', 'salt')`
    );
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE name = 'owner1'`
    );
    const user = rows[0];
    conn.release();
    const result = await insertTeam(testConnection, 'Test Team', user.id);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Test Team');
  });
});
