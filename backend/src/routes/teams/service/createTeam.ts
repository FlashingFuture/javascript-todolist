import { insertTeam } from '../model';
import { InternalRegisterDTO } from '../types';
import { MessageResponse } from '@/types/common';

export const createTeam = async ({
  teamId,
  ownerId,
}: InternalRegisterDTO): Promise<MessageResponse> => {
  const createdTeam = await insertTeam(teamId, ownerId);

  return {
    status: 201,
    message: `${teamId} 팀이 만들어졌습니다.`,
    data: createdTeam,
  };
};
