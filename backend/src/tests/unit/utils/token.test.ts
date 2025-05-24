import 'dotenv/config';
import { signToken, verifyToken } from '../../../utils/token';

describe('JWT 토큰 유틸', () => {
  const id = 1;
  const userId = 'testuser123';

  test('signToken은 유효한 JWT 문자열을 반환해야 한다', () => {
    const token = signToken(id, userId);

    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  test('verifyToken은 유효한 토큰일 경우 payload를 반환해야 한다', () => {
    const token = signToken(id, userId);
    const payload = verifyToken(token);

    expect(payload).toBeDefined();
    expect(payload.id).toBe(id);
    expect(payload.userId).toBe(userId);
  });

  test('verifyToken은 잘못된 토큰일 경우 null을 반환해야 한다', () => {
    const payload = verifyToken('invalid.token.value');

    expect(payload).toBeNull();
  });
});
