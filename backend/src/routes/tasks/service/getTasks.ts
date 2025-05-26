import { MessageResponse } from '@/types/common';
import { GetTeamTaskDTO, GetUserTaskDTO } from '../types';
import { selectTeamTasks, selectUserTasks } from '../model';
import { connection } from '@/database/mariadb';

export const getUserTasks = async ({
  userId,
}: GetUserTaskDTO): Promise<MessageResponse> => {
  const tasks = await selectUserTasks(connection, userId);
  const tasksDone = tasks.filter((task) => task.isDone);
  const tasksTodo = tasks.filter((task) => !task.isDone);

  return {
    status: 200,
    message: '조회 성공',
    data: { tasksTodo, tasksDone },
  };
};

export const getTeamTasks = async ({
  teamId,
}: GetTeamTaskDTO): Promise<MessageResponse> => {
  const tasks = await selectTeamTasks(connection, teamId);
  const tasksDone = tasks.filter((task) => task.isDone);
  const tasksTodo = tasks.filter((task) => !task.isDone);

  return {
    status: 200,
    message: '조회 성공',
    data: { tasksTodo, tasksDone },
  };
};
