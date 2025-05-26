import { updateUserTask, updateTeamTask } from '../model';
import type { Pool } from 'mysql2/promise';
import { MessageResponse } from '@/types/common';
import { validateTaskAccess } from '@/utils/accessControl/validateTaskAccess';
import { HTTPError } from '@/utils/httpError';
import { UpdateTeamTaskDTO, UpdateUserTaskDTO } from '../types';

export const updateUserTaskService = async (
  db: Pool,
  { taskId, contents, duration, userId }: UpdateUserTaskDTO
): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(db, taskId, userId);
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const updatedTask = await updateUserTask(db, {
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

export const updateTeamTaskService = async (
  db: Pool,
  { taskId, contents, duration, teamId, userId }: UpdateTeamTaskDTO
): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(db, taskId, userId, teamId);
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const updatedTask = await updateTeamTask(db, {
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
