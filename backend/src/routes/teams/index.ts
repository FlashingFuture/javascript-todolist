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

router.post(
  '/',
  authRequired(true),
  ...registerTeamValidator,
  users.createTeamController
);
router.get('/', authRequired(true), users.getTeamsController);
router.delete(
  '/:teamId',
  authRequired(true),
  ...deleteTeamValidator,
  users.deleteTeamController
);
router.get(
  '/members/:teamId',
  authRequired(true),
  ...getMembersValidator,
  users.getTeamMembersController
);
router.post(
  '/members/:teamId',
  authRequired(true),
  ...registerMemberValidator,
  users.registerMemberController
);
router.delete(
  '/members/:teamId',
  authRequired(true),
  ...deleteMemberValidator,
  users.deleteTeamMemberController
);

export default router;
