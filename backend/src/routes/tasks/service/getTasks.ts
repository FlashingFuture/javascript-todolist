import { MessageResponse } from '@/types/common';
import { GetTeamTaskDTO, GetUserTaskDTO } from '../types';
import { selectTeamTasks, selectUserTasks } from '../model';
import type { Pool } from 'mysql2/promise';

export const getUserTasks = async (
  db: Pool,
  { userId }: GetUserTaskDTO
): Promise<MessageResponse> => {
  const tasks = await selectUserTasks(db, userId);
  const tasksDone = tasks.filter((task) => task.isDone);
  const tasksTodo = tasks.filter((task) => !task.isDone);

  return {
    status: 200,
    message: '조회 성공',
    data: { tasksTodo, tasksDone },
  };
};

export const getTeamTasks = async (
  db: Pool,
  { teamId }: GetTeamTaskDTO
): Promise<MessageResponse> => {
  const tasks = await selectTeamTasks(db, teamId);
  const tasksDone = tasks.filter((task) => task.isDone);
  const tasksTodo = tasks.filter((task) => !task.isDone);

  return {
    status: 200,
    message: '조회 성공',
    data: { tasksTodo, tasksDone },
  };
};
