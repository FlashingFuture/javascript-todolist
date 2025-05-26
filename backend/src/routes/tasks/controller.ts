import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/types/common';
import { createTeamTask, createUserTask } from './service/createTask';
import { getTeamTasks, getUserTasks } from './service/getTasks';
import {
  updateTeamTaskService as updateTeamTask,
  updateUserTaskService as updateUserTask,
} from './service/updateTask';
import {
  deleteTeamTaskService as deleteTeamTask,
  deleteUserTaskService as deleteUserTask,
} from './service/deleteTask';
import { completeTeamTask, completeUserTask } from './service/completeTask';
import {
  CompleteTeamTaskDTO,
  CompleteUserTaskDTO,
  CreateTeamTaskDTO,
  CreateUserTaskDTO,
  DeleteTeamTaskDTO,
  DeleteUserTaskDTO,
  GetTeamTaskDTO,
  GetUserTaskDTO,
  UpdateTeamTaskDTO,
  UpdateUserTaskDTO,
} from './types';

export const createTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const db = req.app.locals.db;
  const userId = (req as AuthenticatedRequest).user!.id;
  const { teamId, contents, duration } = req.body;

  const result = teamId
    ? await createTeamTask(db, {
        teamId,
        userId,
        contents,
        duration,
      } as CreateTeamTaskDTO)
    : await createUserTask(db, {
        userId,
        contents,
        duration,
      } as CreateUserTaskDTO);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const getTasksController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const db = req.app.locals.db;

  const userId = (req as AuthenticatedRequest).user!.id;
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;

  const result = teamId
    ? await getTeamTasks(db, { teamId } as GetTeamTaskDTO)
    : await getUserTasks(db, { userId } as GetUserTaskDTO);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const updateTaskController = async (req: Request, res: Response) => {
  const db = req.app.locals.db;

  const taskId = Number(req.params.taskId);
  const { contents, duration, teamId } = req.body;
  const userId = (req as AuthenticatedRequest).user!.id;

  const result = teamId
    ? await updateTeamTask(db, {
        taskId,
        contents,
        duration,
        teamId,
        userId,
      } as UpdateTeamTaskDTO)
    : await updateUserTask(db, {
        taskId,
        contents,
        duration,
        userId,
      } as UpdateUserTaskDTO);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const deleteTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const db = req.app.locals.db;

  const userId = (req as AuthenticatedRequest).user!.id;
  const taskId = Number(req.params.taskId);
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;

  const result = teamId
    ? await deleteTeamTask(db, {
        taskId,
        teamId,
        userId,
      } as DeleteTeamTaskDTO)
    : await deleteUserTask(db, { taskId, userId } as DeleteUserTaskDTO);

  res.status(result.status).json({ message: result.message });
};

export const completeTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const db = req.app.locals.db;

  const userId = (req as AuthenticatedRequest).user!.id;
  const taskId = Number(req.params.taskId);
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;

  const result = teamId
    ? await completeTeamTask(db, {
        taskId,
        teamId,
        userId,
      } as CompleteTeamTaskDTO)
    : await completeUserTask(db, { taskId, userId } as CompleteUserTaskDTO);

  res.status(result.status).json({ message: result.message });
};
