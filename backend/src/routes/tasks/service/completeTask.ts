import type { Pool } from 'mysql2/promise';
import { HTTPError } from '@/utils/httpError';
import { MessageResponse } from '@/types/common';
import { finishTeamTask, finishUserTask } from '../model';
import { validateTaskAccess } from '@/utils/accessControl/validateTaskAccess';
import { CompleteTeamTaskDTO, CompleteUserTaskDTO } from '../types';

export const completeUserTask = async (
  db: Pool,
  { taskId, userId }: CompleteUserTaskDTO
): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(db, taskId, userId);
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const completedTask = await finishUserTask(db, taskId, userId);
  if (!completedTask) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 201,
    message: '할 일이 완료 상태로 바뀌었습니다.',
    data: completedTask,
  };
};

export const completeTeamTask = async (
  db: Pool,
  { taskId, teamId, userId }: CompleteTeamTaskDTO
): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(db, taskId, userId, teamId);
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const completedTask = await finishTeamTask(db, taskId, teamId);
  if (!completedTask) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 201,
    message: '할 일이 완료 상태로 바뀌었습니다.',
    data: completedTask,
  };
};
