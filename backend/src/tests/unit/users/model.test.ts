import { insertUser, selectUser } from '@/routes/users/model';
import { randomUUID } from 'crypto';
import { testConnection } from '@/database/testDB';

describe('User Model', () => {
  const testUser = {
    userId: `test_${randomUUID()}`,
    password: 'password',
    salt: 'testSalt',
  };

  test('새로운 사용자를 생성할 수 있어야 한다', async () => {
    const result = await insertUser(testConnection, testUser);

    expect(result).toHaveProperty('id');
    expect(result.userId).toBe(testUser.userId);
  });

  test('동일한 userId로 두 번 생성 시 오류가 발생해야 한다', async () => {
    await insertUser(testConnection, testUser);

    await expect(insertUser(testConnection, testUser)).rejects.toThrow(
      /이미 존재하는 사용자|ER_DUP_ENTRY|Duplicate/
    );
  });

  test('존재하는 사용자를 selectUser로 조회할 수 있어야 한다', async () => {
    const created = await insertUser(testConnection, testUser);
    const found = await selectUser(testConnection, testUser.userId);
    console.log(found);

    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
    expect(found!.passwordHash).toBe(testUser.password);
    expect(found!.salt).toBe(testUser.salt);
  });

  test('존재하지 않는 사용자는 null을 반환해야 한다', async () => {
    const result = await selectUser(testConnection, 'not_test_user');
    expect(result).toBeNull();
  });
});
