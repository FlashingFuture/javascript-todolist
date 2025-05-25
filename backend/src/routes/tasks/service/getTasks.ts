import { MessageResponse } from '@/types/common';
import { GetTasksDTO } from '../types';
import { selectTeamTasks, selectUserTasks } from '../model';
import { connection } from '@/database/mariadb';

export const getTasks = async ({
  userId,
  teamId,
}: GetTasksDTO): Promise<MessageResponse> => {
  const tasks = teamId
    ? await selectTeamTasks(connection, teamId)
    : await selectUserTasks(connection, userId);

  const tasksDone = tasks.filter((task) => task.isDone);
  const tasksTodo = tasks.filter((task) => !task.isDone);

  return {
    status: 200,
    message: '조회 성공',
    data: { tasksTodo, tasksDone },
  };
};
