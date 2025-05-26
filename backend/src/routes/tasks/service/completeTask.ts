import { connection } from '@/database/mariadb';
import { HTTPError } from '@/utils/httpError';
import { MessageResponse } from '@/types/common';
import { finishTeamTask, finishUserTask } from '../model';
import { validateTaskAccess } from '@/utils/accessControl/validateTaskAccess';
import { CompleteTeamTaskDTO, CompleteUserTaskDTO } from '../types';

export const completeUserTask = async ({
  taskId,
  userId,
}: CompleteUserTaskDTO): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(connection, taskId, userId);
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const completedTask = await finishUserTask(connection, taskId, userId);
  if (!completedTask) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 201,
    message: '할 일이 완료 상태로 바뀌었습니다.',
    data: completedTask,
  };
};

export const completeTeamTask = async ({
  taskId,
  teamId,
  userId,
}: CompleteTeamTaskDTO): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(
    connection,
    taskId,
    userId,
    teamId
  );
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const completedTask = await finishTeamTask(connection, taskId, teamId);
  if (!completedTask) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 201,
    message: '할 일이 완료 상태로 바뀌었습니다.',
    data: completedTask,
  };
};
