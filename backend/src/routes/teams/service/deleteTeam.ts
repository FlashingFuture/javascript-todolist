import { selectTeamById, deleteTeamById } from '../model';
import { DeleteTeamDTO } from '../types';
import { HTTPError } from '@/utils/httpError';
import { Pool } from 'mysql2/promise';

export const deleteTeam = async (
  db: Pool,
  { teamId, ownerId }: DeleteTeamDTO
): Promise<{ teamName: string }> => {
  const team = await selectTeamById(db, teamId);

  if (!team) {
    throw new HTTPError(404, '팀을 찾을 수 없습니다.');
  }
  if (team.owner_id !== ownerId) {
    throw new HTTPError(403, '팀장만 팀을 삭제할 수 있습니다.');
  }

  await deleteTeamById(db, teamId);

  return { teamName: team.name };
};
