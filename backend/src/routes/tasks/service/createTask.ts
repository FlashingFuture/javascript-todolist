import { MessageResponse } from '@/types/common';
import { CreateTaskDTO } from '../types';
import { connection } from '@/database/mariadb';
import { insertUserTask, insertTeamTask } from '../model';

export const createTask = async ({
  userId,
  teamId,
  contents,
  duration,
}: CreateTaskDTO): Promise<MessageResponse> => {
  const createdTask = teamId
    ? await insertTeamTask(connection, { teamId, contents, duration })
    : await insertUserTask(connection, { userId, contents, duration });

  return {
    status: 201,
    message: '할 일 등록 성공',
    data: createdTask,
  };
};
