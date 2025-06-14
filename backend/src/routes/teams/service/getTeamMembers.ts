import { MessageResponse } from '@/types/common';
import { selectTeamById, selectMembersByTeamId } from '../model';
import { HTTPError } from '@/utils/httpError';
import { GetTeamMembersDTO } from '../types';
import { Pool } from 'mysql2/promise';

export const getTeamMembers = async (
  db: Pool,
  { teamId, requesterId }: GetTeamMembersDTO
): Promise<MessageResponse> => {
  const team = await selectTeamById(db, teamId);
  if (!team) throw new HTTPError(404, '팀을 찾을 수 없습니다.');

  if (team.owner_id !== requesterId) {
    throw new HTTPError(403, '팀장만 팀원을 조회할 수 있습니다.');
  }

  const members = await selectMembersByTeamId(db, teamId);

  return {
    status: 200,
    message: `조회 성공`,
    data: members,
  };
};
