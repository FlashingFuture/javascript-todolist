jest.mock('@/routes/users/model', () => ({
  insertUser: jest.fn(),
}));

import { register } from '@/routes/users/service/register';
import { insertUser } from '@/routes/users/model';
import { testConnection } from '@/database/testDB';

describe('register()', () => {
  test('비밀번호 불일치 시 400 에러', async () => {
    await expect(
      register(testConnection, {
        userId: 'test',
        password: 'a',
        rePassword: 'b',
      })
    ).rejects.toThrow(/비밀번호 확인/);
  });

  test('정상적인 경우 createUser 호출 및 응답 확인', async () => {
    (insertUser as jest.Mock).mockResolvedValue({ id: 1, userId: 'test' });

    const res = await register(testConnection, {
      userId: 'test',
      password: 'pw',
      rePassword: 'pw',
    });

    expect(res.status).toBe(201);
    expect(res.data).toEqual({ id: 1, userId: 'test' });
    expect(insertUser).toHaveBeenCalled();
  });
});
