jest.mock('@/routes/users/model', () => ({
  createUser: jest.fn(),
}));

import { register } from '@/routes/users/service/register';
import { createUser } from '@/routes/users/model';

describe('register()', () => {
  test('비밀번호 불일치 시 400 에러', async () => {
    await expect(
      register({
        userId: 'test',
        password: 'a',
        rePassword: 'b',
      })
    ).rejects.toThrow(/비밀번호 확인/);
  });

  test('정상적인 경우 createUser 호출 및 응답 확인', async () => {
    (createUser as jest.Mock).mockResolvedValue({ id: 1, userId: 'test' });

    const res = await register({
      userId: 'test',
      password: 'pw',
      rePassword: 'pw',
    });

    expect(res.status).toBe(201);
    expect(res.data).toEqual({ id: 1, userId: 'test' });
    expect(createUser).toHaveBeenCalled();
  });
});
