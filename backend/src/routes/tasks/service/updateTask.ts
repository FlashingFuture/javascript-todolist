import { updateUserTask, updateTeamTask } from '../model';
import { connection } from '@/database/mariadb';
import { MessageResponse } from '@/types/common';
import { validateTaskAccess } from '@/utils/accessControl/validateTaskAccess';
import { HTTPError } from '@/utils/httpError';
import { UpdateTeamTaskDTO, UpdateUserTaskDTO } from '../types';

export const updateUserTaskService = async ({
  taskId,
  contents,
  duration,
  userId,
}: UpdateUserTaskDTO): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(connection, taskId, userId);
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const updatedTask = await updateUserTask(connection, {
    taskId,
    contents,
    duration,
    userId,
  });

  if (!updatedTask) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 200,
    message: '수정 완료',
    data: updatedTask,
  };
};

export const updateTeamTaskService = async ({
  taskId,
  contents,
  duration,
  teamId,
  userId,
}: UpdateTeamTaskDTO): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(
    connection,
    taskId,
    userId,
    teamId
  );
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const updatedTask = await updateTeamTask(connection, {
    taskId,
    contents,
    duration,
    teamId,
  });

  if (!updatedTask) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 200,
    message: '수정 완료',
    data: updatedTask,
  };
};
