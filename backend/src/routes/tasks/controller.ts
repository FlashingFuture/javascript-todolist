import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/types/common';
import { createTask as createTask } from './service/createTask';
import { getTasks as getTasks } from './service/getTasks';
import { updateTaskService as updateTask } from './service/updateTask';
import { deleteTask } from './service/deleteTask';
import { completeTask } from './service/completeTask';
import {
  CompleteTaskDTO,
  CreateTaskDTO,
  DeleteTaskDTO,
  GetTasksDTO,
  UpdateTaskDTO,
} from './types';

export const createTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const { teamId, contents, duration } = req.body;

  const dto: CreateTaskDTO = { userId, teamId, contents, duration };
  const result = await createTask(dto);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
  return;
};

export const getTasksController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;

  const dto: GetTasksDTO = { userId, teamId };
  const result = await getTasks(dto);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
  return;
};

export const updateTaskController = async (req: Request, res: Response) => {
  const taskId = Number(req.params.taskId);
  const { contents, duration, teamId } = req.body;
  const userId = (req as AuthenticatedRequest).user!.id;

  const dto: UpdateTaskDTO = { taskId, contents, duration, userId, teamId };
  const result = await updateTask(dto);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
  return;
};

export const deleteTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const taskId = Number(req.params.taskId);
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;

  const dto: DeleteTaskDTO = { taskId, userId, teamId };
  const result = await deleteTask(dto);

  res.status(result.status).json({ message: result.message });
};

export const completeTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const taskId = Number(req.params.taskId);
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;

  const dto: CompleteTaskDTO = { taskId, userId, teamId };
  const result = await completeTask(dto);

  res.status(result.status).json({ message: result.message });
};
