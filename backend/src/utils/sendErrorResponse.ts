import { Response } from 'express';
import { HTTPError } from './httpError';

export const sendErrorResponse = (res: Response, error: unknown): void => {
  if (error instanceof HTTPError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof Error) {
    if ((error as any).code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: '이미 존재하는 유니크 값입니다.' });
      return;
    }

    res.status(500).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: '알 수 없는 오류입니다.' });
};
