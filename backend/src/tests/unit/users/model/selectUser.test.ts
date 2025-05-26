import { selectUser, insertUser } from '@/routes/users/model';
import { testConnection } from '@/database/testDB';

describe('selectUser()', () => {
  const testUser = {
    userId: `test_user`,
    password: 'pw',
    salt: 'salt',
  };

  test('존재하는 사용자 조회 가능', async () => {
    const created = await insertUser(testConnection, testUser);
    const found = await selectUser(testConnection, testUser.userId);

    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
    expect(found!.passwordHash).toBe(testUser.password);
    expect(found!.salt).toBe(testUser.salt);
  });

  test('존재하지 않는 사용자 조회 시 null 반환', async () => {
    const result = await selectUser(testConnection, 'non_existent_user');
    expect(result).toBeNull();
  });
});
