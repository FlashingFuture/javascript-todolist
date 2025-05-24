import { MessageResponse } from '@/types/common';
import { RegisterDTO } from '../types';
import { connection } from '@/database/mariadb';
import { insertUserTask, insertTeamTask } from '../model';
import { validateTeamAccess } from '@/routes/teams/service/validateTeamAccess';

export const register = async ({
  userId,
  teamId,
  contents,
  duration,
}: RegisterDTO): Promise<MessageResponse> => {
  if (teamId) {
    await validateTeamAccess(connection, teamId, userId);
  }

  const createdTask = teamId
    ? await insertTeamTask(connection, { teamId, contents, duration })
    : await insertUserTask(connection, { userId, contents, duration });

  return {
    status: 201,
    message: '할 일 등록 성공',
    data: createdTask,
  };
};
