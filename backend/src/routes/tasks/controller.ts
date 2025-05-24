import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/types/common';
import { register } from './service/register';
import { getTasksService } from './service/getTasks';
import { updateTaskService } from './service/updateTask';
import { deleteTaskService } from './service/deleteTask';
import { completeTaskService } from './service/completeTask';

export const registerTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const { teamId, contents, duration } = req.body;
  const result = await register({ userId, teamId, contents, duration });

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
  return;
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
  const result = await getTasksService({ userId, teamId });

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
  return;
};

export const updateTask = async (req: Request, res: Response) => {
  const taskId = Number(req.params.taskId);
  const { contents, duration, teamId } = req.body;
  const userId = (req as AuthenticatedRequest).user!.id;

  const result = await updateTaskService({
    taskId,
    contents,
    duration,
    userId,
    teamId,
  });

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
  return;
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const taskId = Number(req.params.taskId);
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;

  const result = await deleteTaskService({ taskId, userId, teamId });

  res.status(result.status).json({ message: result.message });
};

export const completeTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const taskId = Number(req.params.taskId);
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;

  const result = await completeTaskService({ taskId, userId, teamId });

  res.status(result.status).json({ message: result.message });
};
