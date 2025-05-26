import express from 'express';
import * as tasks from './controller';
import { authRequired } from '@/middlewares/authRequired';
import { createTaskValidator, updateTaskValidator } from './validator';

const router = express.Router();
router.post(
  '/',
  authRequired(true),
  createTaskValidator,
  tasks.createTaskController
);
router.get('/', authRequired(true), tasks.getTasksController);
router.put(
  '/:taskId',
  authRequired(true),
  updateTaskValidator,
  tasks.updateTaskController
);
router.delete('/:taskId', authRequired(true), tasks.deleteTaskController);
router.post('/:taskId', authRequired(true), tasks.completeTaskController);

export default router;
