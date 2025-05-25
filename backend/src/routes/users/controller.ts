import { setAuthCookie } from '@/utils/setAuthCookie';
import { login } from './service/login';
import { register } from './service/register';
import { Request, Response } from 'express';
import { RegisterDTO, LoginDTO } from './types';

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, password, rePassword } = req.body;
  const dto: RegisterDTO = { userId, password, rePassword };
  const result = await register(dto);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
  return;
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, password } = req.body;
  const dto: LoginDTO = { userId, password };
  const result = await login(dto);

  setAuthCookie(res, result.data.token);

  res.status(result.status).json({ message: result.message });
};
