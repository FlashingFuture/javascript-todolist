import { body, param } from 'express-validator';
import { validateRequest } from '@/middlewares/validateRequest';

export const registerTeamValidator = [
  body('teamId').notEmpty().withMessage('teamId가 body에 필요합니다.'),
  validateRequest,
];

export const registerMemberValidator = [
  param('teamId').isInt({ min: 1 }).withMessage('올바르지 않은 팀 ID입니다.'),
  body('newMemberId')
    .isString()
    .notEmpty()
    .withMessage('추가할 팀원의 사용자 ID가 필요합니다.'),
  validateRequest,
];

export const deleteTeamValidator = [
  param('teamId').isInt({ min: 1 }).withMessage('올바르지 않은 팀 ID입니다.'),
  validateRequest,
];

export const deleteMemberValidator = [
  param('teamId').isInt({ min: 1 }).withMessage('올바르지 않은 팀 ID입니다.'),
  body('memberId').isInt().withMessage('삭제할 유저 ID가 유효하지 않습니다.'),
  validateRequest,
];

export const getMembersValidator = [
  param('teamId').isInt({ min: 1 }).withMessage('올바르지 않은 팀 ID입니다.'),
  validateRequest,
];
