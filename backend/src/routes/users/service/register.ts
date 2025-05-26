import { StatusCodes } from 'http-status-codes';
import { RegisterDTO } from '../types';
import { MessageResponse } from '@/types/common';
import { HTTPError } from '@/utils/httpError';
import { hashPassword } from '@/utils/password';
import { insertUser } from '../model';
import { Pool } from 'mysql2/promise';

export const register = async (
  db: Pool,
  { userId, password, rePassword }: RegisterDTO
): Promise<MessageResponse> => {
  if (password !== rePassword) {
    throw new HTTPError(
      StatusCodes.BAD_REQUEST,
      '비밀번호 확인에 실패했습니다. 비밀번호를 다시 확인해 주세요.'
    );
  }

  const { passwordHash, salt } = hashPassword(password);
  const createdUser = await insertUser(db, {
    userId,
    password: passwordHash,
    salt,
  });

  return {
    status: StatusCodes.CREATED,
    message: '회원가입 성공',
    data: createdUser,
  };
};
