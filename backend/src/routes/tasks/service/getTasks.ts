import { MessageResponse } from '@/types/common';
import { SelectTaskDTO } from '../types';
import { selectTeamTasks, selectUserTasks } from '../model';
import { connection } from '@/database/mariadb';
import { validateTeamAccess } from '@/routes/teams/service/validateTeamAccess';

export const getTasksService = async ({
  userId,
  teamId,
}: SelectTaskDTO): Promise<MessageResponse> => {
  if (teamId) {
    await validateTeamAccess(connection, teamId, userId);
  }
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
