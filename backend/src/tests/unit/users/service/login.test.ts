jest.mock('@/routes/users/model', () => ({
  selectUser: jest.fn(),
}));

jest.mock('@/utils/password', () => ({
  verifyPassword: jest.fn(),
}));

jest.mock('@/utils/token', () => ({
  signToken: jest.fn(),
}));

import { login } from '@/routes/users/service/login';
import { selectUser } from '@/routes/users/model';
import { verifyPassword } from '@/utils/password';
import { signToken } from '@/utils/token';
import { testConnection } from '@/database/testDB';

describe('login()', () => {
  const baseDTO = {
    userId: 'testUser',
    password: 'pw123',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('존재하지 않는 유저일 경우 401 에러', async () => {
    (selectUser as jest.Mock).mockResolvedValue(null);

    await expect(login(testConnection, baseDTO)).rejects.toThrow(
      /로그인 정보가 잘못되었습니다/
    );
  });

  test('비밀번호가 틀릴 경우 401 에러', async () => {
    (selectUser as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 'testUser',
      passwordHash: 'hashed_pw',
      salt: 'salt',
    });

    (verifyPassword as jest.Mock).mockReturnValue(false);

    await expect(login(testConnection, baseDTO)).rejects.toThrow(
      /로그인 정보가 잘못되었습니다/
    );
  });

  test('정상 로그인 시 토큰이 포함된 응답 반환', async () => {
    (selectUser as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 'testUser',
      passwordHash: 'hashed_pw',
      salt: 'salt',
    });

    (verifyPassword as jest.Mock).mockReturnValue(true);
    (signToken as jest.Mock).mockReturnValue('mocked_token');

    const result = await login(testConnection, baseDTO);

    expect(result.status).toBe(200);
    expect(result.message).toMatch(/성공/);
    expect(result.data.token).toBe('mocked_token');
    expect(verifyPassword).toHaveBeenCalled();
    expect(signToken).toHaveBeenCalledWith(1, 'testUser');
  });
});
