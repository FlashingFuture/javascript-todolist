import { StatusCodes } from 'http-status-codes';
import { RegisterMemberDTO } from '../types';
import { selectTeamById, selectUserByUserId, insertTeamMember } from '../model';
import { HTTPError } from '@/utils/httpError';
import { MessageResponse } from '@/types/common';

export const registerMember = async ({
  teamId,
  ownerId,
  newMemberId,
}: RegisterMemberDTO): Promise<MessageResponse> => {
  const team = await selectTeamById(teamId);
  if (!team) {
    throw new HTTPError(StatusCodes.NOT_FOUND, '팀을 찾을 수 없습니다.');
  }
  if (team.owner_id !== ownerId) {
    throw new HTTPError(
      StatusCodes.FORBIDDEN,
      '팀장만 팀원을 추가할 수 있습니다.'
    );
  }

  const user = await selectUserByUserId(newMemberId);
  if (!user) throw new HTTPError(404, '추가할 사용자를 찾을 수 없습니다.');

  await insertTeamMember(teamId, user.id);

  return {
    status: StatusCodes.OK,
    message: `${user.name}이 ${team.name}에 팀원으로 추가되었습니다.`,
    data: { userId: user.name, teamId: team.name },
  };
};
