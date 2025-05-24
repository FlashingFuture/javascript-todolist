import { Request, Response, NextFunction } from 'express';
import { signToken, verifyToken } from '@/utils/token';
import { HTTPError } from '@/utils/httpError';
import { AuthenticatedRequest } from '@/types/common';
import { setAuthCookie } from '@/utils/setAuthCookie';

export const authRequired =
  (required: boolean) => (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.todolist_token || '';
    const payload = verifyToken(token);

    if (!payload && required) {
      throw new HTTPError(401, '유효하지 않은 토큰입니다.');
    }

    if (payload) {
      (req as AuthenticatedRequest).user = payload;
      const newToken = signToken(payload.id, payload.userId);
      setAuthCookie(res, newToken);
    }

    next();
  };
