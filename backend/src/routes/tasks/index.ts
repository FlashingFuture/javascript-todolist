import express from 'express';
import * as tasks from './controller';
import { authRequired } from '@/middlewares/authRequired';
import { registerValidator, updateTaskValidator } from './validator';

const router = express.Router();
router.post('/', authRequired(true), registerValidator, tasks.registerTask);
router.get('/', authRequired(true), tasks.getTasks);
router.put(
  '/:taskId',
  authRequired(true),
  updateTaskValidator,
  tasks.updateTask
);
router.delete('/:taskId', authRequired(true), tasks.deleteTask);
router.post('/:taskId', authRequired(true), tasks.completeTask);

export default router;
