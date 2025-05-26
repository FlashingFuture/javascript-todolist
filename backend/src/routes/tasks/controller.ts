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
  const userId = (req as AuthenticatedRequest).user!.id;
  const { teamId, contents, duration } = req.body;

  const result = teamId
    ? await createTeamTask({
        teamId,
        userId,
        contents,
        duration,
      } as CreateTeamTaskDTO)
    : await createUserTask({
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
  const userId = (req as AuthenticatedRequest).user!.id;
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;

  const result = teamId
    ? await getTeamTasks({ teamId } as GetTeamTaskDTO)
    : await getUserTasks({ userId } as GetUserTaskDTO);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const updateTaskController = async (req: Request, res: Response) => {
  const taskId = Number(req.params.taskId);
  const { contents, duration, teamId } = req.body;
  const userId = (req as AuthenticatedRequest).user!.id;

  const result = teamId
    ? await updateTeamTask({
        taskId,
        contents,
        duration,
        teamId,
        userId,
      } as UpdateTeamTaskDTO)
    : await updateUserTask({
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
  const userId = (req as AuthenticatedRequest).user!.id;
  const taskId = Number(req.params.taskId);
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;

  const result = teamId
    ? await deleteTeamTask({
        taskId,
        teamId,
        userId,
      } as DeleteTeamTaskDTO)
    : await deleteUserTask({ taskId, userId } as DeleteUserTaskDTO);

  res.status(result.status).json({ message: result.message });
};

export const completeTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const taskId = Number(req.params.taskId);
  const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;

  const result = teamId
    ? await completeTeamTask({ taskId, teamId, userId } as CompleteTeamTaskDTO)
    : await completeUserTask({ taskId, userId } as CompleteUserTaskDTO);

  res.status(result.status).json({ message: result.message });
};
