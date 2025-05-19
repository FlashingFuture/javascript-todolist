import { registerUser as registerUserService } from './service/registerUser';
import { Request, Response } from 'express';

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await registerUserService(req.body);
  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
  return;
};
