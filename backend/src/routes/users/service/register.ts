import { StatusCodes } from 'http-status-codes';
import { RegisterDTO, MessageResponse } from '@/types/user';
import { HTTPError } from '@/utils/httpError';
import { hashPassword } from '@/utils/password';
import { createUser } from '../model';

export const register = async ({
  userId,
  password,
  rePassword,
}: RegisterDTO): Promise<MessageResponse> => {
  if (password !== rePassword) {
    throw new HTTPError(
      StatusCodes.BAD_REQUEST,
      '비밀번호 확인에 실패했습니다. 비밀번호를 다시 확인해 주세요.'
    );
  }

  const { passwordHash, salt } = hashPassword(password);
  const createdUser = await createUser({
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
