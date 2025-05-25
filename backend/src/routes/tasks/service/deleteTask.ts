import { connection } from '@/database/mariadb';
import { deleteUserTask, deleteTeamTask } from '../model';
import type { MessageResponse } from '@/types/common';
import { HTTPError } from '@/utils/httpError';
import { validateTaskAccess } from '@/service/accessControl/validateTaskAccess';
import { DeleteTaskDTO } from '../types';

export const deleteTask = async ({
  taskId,
  userId,
  teamId,
}: DeleteTaskDTO): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(
    connection,
    taskId,
    userId,
    teamId
  );
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }
  let deleted = false;
  if (teamId) {
    deleted = await deleteTeamTask(connection, taskId, teamId);
  } else {
    deleted = await deleteUserTask(connection, taskId, userId);
  }

  if (!deleted) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 200,
    message: '할 일이 삭제되었습니다.',
  };
};
