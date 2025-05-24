import express from 'express';
import * as users from './controller';
import {
  registerTeamValidator,
  getMembersValidator,
  registerMemberValidator,
  deleteMemberValidator,
  deleteTeamValidator,
} from './validator';
import { authRequired } from '@/middlewares/authRequired';

const router = express.Router();

router.post('/', authRequired(true), ...registerTeamValidator, users.registerTeam);
router.get('/', authRequired(true), users.getUsersTeams);
router.delete(
  '/:teamId',
  authRequired(true),
  ...deleteTeamValidator,
  users.deleteTeam
);
router.get(
  '/members/:teamId',
  authRequired(true),
  ...getMembersValidator,
  users.getTeamMembers
);
router.post(
  '/members/:teamId',
  authRequired(true),
  ...registerMemberValidator,
  users.registerMember
);
router.delete(
  '/members/:teamId',
  authRequired(true),
  ...deleteMemberValidator,
  users.deleteTeamMember
);

export default router;
