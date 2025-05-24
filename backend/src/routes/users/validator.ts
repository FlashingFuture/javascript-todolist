import { body } from 'express-validator';
import { validateRequest } from '@/middlewares/validateRequest';

export const registerValidator = [
  body('userId').notEmpty().withMessage('userId가 body에 필요합니다.'),
  body('password').notEmpty().withMessage('password가 body에 필요합니다.'),
  validateRequest,
];

export const loginValidator = [
  body('userId').notEmpty().withMessage('userId가 body에 필요합니다.'),
  body('password').notEmpty().withMessage('password가 body에 필요합니다.'),
  validateRequest,
];
