import { updateUserTask, updateTeamTask } from '../model';
import { connection } from '@/database/mariadb';
import { validateTeamAccess } from '@/routes/teams/service/validateTeamAccess';
import { MessageResponse } from '@/types/common';

export const updateTaskService = async ({
  taskId,
  userId,
  teamId,
  contents,
  duration,
}: {
  taskId: number;
  userId: number;
  teamId?: number;
  contents: string;
  duration: number;
}): Promise<MessageResponse> => {
  if (teamId) {
    await validateTeamAccess(connection, teamId, userId);
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
