import { updateUserTask, updateTeamTask } from '../model';
import { connection } from '@/database/mariadb';
import { MessageResponse } from '@/types/common';
import { validateTaskAccess } from '@/service/accessControl/validateTaskAccess';
import { HTTPError } from '@/utils/httpError';
import { UpdateTaskDTO } from '../types';

export const updateTaskService = async ({
  taskId,
  userId,
  teamId,
  contents,
  duration,
}: UpdateTaskDTO): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(
    connection,
    taskId,
    userId,
    teamId
  );
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const updatedTask = teamId
    ? await updateTeamTask(connection, { taskId, contents, duration, teamId })
    : await updateUserTask(connection, { taskId, contents, duration, userId });

  return {
    status: 200,
    message: '수정 완료',
    data: updatedTask,
  };
};
