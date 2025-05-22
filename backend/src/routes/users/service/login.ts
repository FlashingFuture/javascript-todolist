import { StatusCodes } from 'http-status-codes';
import { HTTPError } from '@/utils/httpError';
import { LoginDTO } from '../types';
import { MessageResponse } from '@/types/common';
import { signToken } from '@/utils/token';
import { verifyPassword } from '@/utils/password';
import { selectUser } from '../model';

export const login = async ({
  userId,
  password,
}: LoginDTO): Promise<MessageResponse> => {
  const user = await selectUser(userId);
  if (!user) {
    throw new HTTPError(
      StatusCodes.UNAUTHORIZED,
      '로그인 정보가 잘못되었습니다. 아이디나 비밀번호를 확인해주세요.'
    );
  }

  const { id, passwordHash, salt } = user;

  if (!verifyPassword(password, salt, passwordHash)) {
    throw new HTTPError(
      StatusCodes.UNAUTHORIZED,
      '로그인 정보가 잘못되었습니다. 아이디나 비밀번호를 확인해주세요.'
    );
  }

  const token = signToken(id, userId);

  return {
    status: StatusCodes.CREATED,
    message: '로그인 성공',
    data: {
      token,
    },
  };
};
