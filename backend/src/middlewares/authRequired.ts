import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { HTTPError } from '@/utils/httpError';
import { AuthenticatedRequest } from '@/types/common';

export const authRequired =
  (required: boolean) => (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (required) {
        throw new HTTPError(401, '로그인이 필요합니다.');
      }
      return next();
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload && required) {
      throw new HTTPError(401, '유효하지 않은 토큰입니다.');
    }

    if (payload) {
      (req as AuthenticatedRequest).user = payload;
    }

    next();
  };
