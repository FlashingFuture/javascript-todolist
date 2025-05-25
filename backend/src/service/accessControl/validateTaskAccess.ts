import { Pool } from 'mysql2/promise';
import { validateUserTaskAccess } from './strategies/validateUserTaskAccess';
import { validateTeamAccess } from './strategies/validateTeamAccess';

export const validateTaskAccess = async (
  db: Pool,
  taskId: number,
  userId: number,
  teamId?: number
): Promise<boolean> => {
  if (teamId) {
    return await validateTeamAccess(db, teamId, userId);
  }
  return await validateUserTaskAccess(db, taskId, userId);
};
