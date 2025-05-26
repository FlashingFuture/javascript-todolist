import { insertUser } from '@/routes/users/model';
import { testConnection } from '@/database/testDB';

describe('insertUser()', () => {
  const testUser = {
    userId: `test_user_${Date.now()}`,
    password: 'password',
    salt: 'salt',
  };

  test('사용자 생성 성공', async () => {
    const result = await insertUser(testConnection, testUser);

    expect(result).toHaveProperty('id');
    expect(result.userId).toBe(testUser.userId);
  });

  test('동일 userId 중복 생성 시 오류 발생', async () => {
    await insertUser(testConnection, testUser);

    await expect(insertUser(testConnection, testUser)).rejects.toThrow(
      /이미 존재하는 사용자|ER_DUP_ENTRY|Duplicate/
    );
  });
});
