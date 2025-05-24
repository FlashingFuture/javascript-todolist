import { connection } from '@/database/mariadb';
import { HTTPError } from '@/utils/httpError';
import { MessageResponse } from '@/types/common';
import { completeTeamTask, completeUserTask } from '../model';
import { validateTeamAccess } from '@/routes/teams/service/validateTeamAccess';

export const completeTaskService = async ({
  taskId,
  userId,
  teamId,
}: {
  taskId: number;
  userId: number;
  teamId?: number;
}): Promise<MessageResponse> => {
  let contents: string | null;

  if (teamId) {
    await validateTeamAccess(connection, teamId, userId);
    contents = await completeTeamTask(connection, taskId, teamId);
  } else {
    contents = await completeUserTask(connection, taskId, userId);
  }

  if (!contents) {
    throw new HTTPError(404, '해당 할 일을 찾을 수 없습니다.');
  }

  return {
    status: 201,
    message: `${contents}이 완료 상태로 바뀌었습니다.`,
  };
};
