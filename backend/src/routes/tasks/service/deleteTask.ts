import { connection } from '@/database/mariadb';
import { deleteUserTask, deleteTeamTask } from '../model';
import { validateTeamAccess } from '@/routes/teams/service/validateTeamAccess';
import type { MessageResponse } from '@/types/common';
import { HTTPError } from '@/utils/httpError';

export const deleteTaskService = async ({
  taskId,
  userId,
  teamId,
}: {
  taskId: number;
  userId: number;
  teamId?: number;
}): Promise<MessageResponse> => {
  let deleted = false;
  if (teamId) {
    await validateTeamAccess(connection, teamId, userId);
    deleted = await deleteTeamTask(connection, taskId, teamId);
  } else {
    deleted = await deleteUserTask(connection, taskId, userId);
  }

  if (!deleted) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 204,
    message: '할 일이 삭제되었습니다.',
  };
};

