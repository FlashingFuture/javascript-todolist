import { register } from './service/register';
import { Request, Response } from 'express';

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await register(req.body);
  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
  return;
};
