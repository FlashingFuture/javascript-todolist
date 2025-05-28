import { body, param } from 'express-validator';
import { validateRequest } from '@/middlewares/validateRequest';

export const createTaskValidator = [
  body('contents')
    .notEmpty()
    .withMessage('할 일 내용을 입력해주세요.')
    .isString()
    .withMessage('할 일 내용은 문자열이어야 합니다.'),

  body('duration')
    .notEmpty()
    .withMessage('기간(duration)을 입력해주세요.')
    .isInt({ min: 1 })
    .withMessage('기간은 1 이상의 정수여야 합니다.'),

  body('teamId').optional().isInt().withMessage('teamId는 숫자여야 합니다.'),

  validateRequest,
];

export const updateTaskValidator = [
  param('taskId').isInt().withMessage('taskId는 정수여야 합니다.'),
  body('contents').notEmpty().withMessage('할 일 내용을 입력해주세요.'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('duration은 1 이상의 정수여야 합니다.'),
  validateRequest,
];
