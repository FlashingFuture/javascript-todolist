import { connection } from '@/database/mariadb';
import { HTTPError } from '@/utils/httpError';
import { validateTeamAccess } from '@/utils/accessControl/strategies/validateTeamAccess';
import { MessageResponse } from '@/types/common';
import { insertUserTask, insertTeamTask } from '../model';
import { CreateTeamTaskDTO, CreateUserTaskDTO } from '../types';

export const createUserTask = async ({
  userId,
  contents,
  duration,
}: CreateUserTaskDTO): Promise<MessageResponse> => {
  const result = await insertUserTask(connection, {
    userId,
    contents,
    duration,
  });

  return {
    status: 201,
    message: '할 일 등록 성공',
    data: result,
  };
};

export const createTeamTask = async ({
  teamId,
  userId,
  contents,
  duration,
}: CreateTeamTaskDTO): Promise<MessageResponse> => {
  const accessGranted = await validateTeamAccess(connection, teamId, userId);
  if (!accessGranted) {
    throw new HTTPError(403, '해당 팀에 할 일을 추가할 권한이 없습니다.');
  }

  const result = await insertTeamTask(connection, {
    teamId,
    contents,
    duration,
  });

  return {
    status: 201,
    message: '할 일 등록 성공',
    data: result,
  };
};
