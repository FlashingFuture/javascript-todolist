import { connection } from '@/database/mariadb';
import { HTTPError } from '@/utils/httpError';
import { MessageResponse } from '@/types/common';
import { completeTeamTask, completeUserTask } from '../model';
import { validateTaskAccess } from '@/service/accessControl/validateTaskAccess';
import { CompleteTaskDTO } from '../types';

export const completeTask = async ({
  taskId,
  userId,
  teamId,
}: CompleteTaskDTO): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(
    connection,
    taskId,
    userId,
    teamId
  );
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const completedTask = teamId
    ? await completeTeamTask(connection, taskId, teamId)
    : await completeUserTask(connection, taskId, userId);

  if (!completeTask) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 201,
    message: `할 일이 완료 상태로 바뀌었습니다.`,
    data: completedTask,
  };
};
