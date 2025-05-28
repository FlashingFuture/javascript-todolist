import type { Pool } from 'mysql2/promise';
import { deleteUserTask, deleteTeamTask } from '../model';
import type { MessageResponse } from '@/types/common';
import { HTTPError } from '@/utils/httpError';
import { validateTaskAccess } from '@/utils/accessControl/validateTaskAccess';
import { DeleteTeamTaskDTO, DeleteUserTaskDTO } from '../types';

export const deleteUserTaskService = async (
  db: Pool,
  { taskId, userId }: DeleteUserTaskDTO
): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(db, taskId, userId);
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const deleted = await deleteUserTask(db, taskId, userId);
  if (!deleted) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 200,
    message: '할 일이 삭제되었습니다.',
  };
};

export const deleteTeamTaskService = async (
  db: Pool,
  { taskId, teamId, userId }: DeleteTeamTaskDTO
): Promise<MessageResponse> => {
  const accessGranted = await validateTaskAccess(db, taskId, userId, teamId);
  if (!accessGranted) {
    throw new HTTPError(403, '해당 작업에 대한 권한이 없습니다.');
  }

  const deleted = await deleteTeamTask(db, taskId, teamId);
  if (!deleted) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 200,
    message: '할 일이 삭제되었습니다.',
  };
};
