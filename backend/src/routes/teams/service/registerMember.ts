import { RegisterMemberDTO } from '../types';
import {
  selectTeamById,
  selectUserByName,
  insertTeamMember,
  selectTeamMemberById,
} from '../model';
import { HTTPError } from '@/utils/httpError';
import { MessageResponse } from '@/types/common';
import type { Pool } from 'mysql2/promise';

export const registerMember = async (
  db: Pool,
  { teamId, ownerId, newMemberId }: RegisterMemberDTO
): Promise<MessageResponse> => {
  const team = await selectTeamById(db, teamId);
  if (!team) {
    throw new HTTPError(404, '팀을 찾을 수 없습니다.');
  }
  if (team.owner_id !== ownerId) {
    throw new HTTPError(403, '팀장만 팀원을 추가할 수 있습니다.');
  }

  const user = await selectUserByName(db, newMemberId);
  if (!user) throw new HTTPError(404, '추가할 사용자를 찾을 수 없습니다.');

  const existingMember = await selectTeamMemberById(db, teamId, user.id);
  if (existingMember) {
    throw new HTTPError(409, '이미 팀에 속한 사용자입니다.');
  }

  await insertTeamMember(db, teamId, user.id);

  return {
    status: 200,
    message: `${user.name}이 ${team.name}에 팀원으로 추가되었습니다.`,
    data: { userId: user.name, teamId: team.name },
  };
};
