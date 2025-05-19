import { body } from 'express-validator';
import { validateRequest } from '@/middlewares/validateRequest';

export const registerValidator = [
  body('userId').notEmpty().withMessage('이름은 필수입니다.'),
  body('password').notEmpty().withMessage('비밀번호는 필수입니다.'),
  validateRequest,
];
