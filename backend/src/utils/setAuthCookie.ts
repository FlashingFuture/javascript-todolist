import { Response } from 'express';

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie('todolist_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60,
  });
};
