import { DeleteTeamMemberDTO } from '../types';
import {
  selectTeamById,
  selectTeamMemberById,
  deleteTeamMemberByUserId,
} from '../model';
import { HTTPError } from '@/utils/httpError';
import { connection } from '@/database/mariadb';

export const deleteTeamMember = async ({
  teamId,
  ownerId,
  memberId,
}: DeleteTeamMemberDTO): Promise<{ userName: string; teamName: string }> => {
  const team = await selectTeamById(connection, teamId);
  if (!team) throw new HTTPError(404, '팀을 찾을 수 없습니다.');
  if (team.owner_id !== ownerId) {
    throw new HTTPError(403, '팀장만 팀원을 삭제할 수 있습니다.');
  }

  const user = await selectTeamMemberById(connection, teamId, memberId);
  if (!user) throw new HTTPError(404, '삭제할 사용자를 찾을 수 없습니다.');

  await deleteTeamMemberByUserId(connection, teamId, memberId);

  return {
    userName: user.name,
    teamName: team.name,
  };
};
