import { StatusCodes } from 'http-status-codes';
import { createTeam } from '../model';
import { InternalRegisterDTO } from '../types';
import { MessageResponse } from '@/types/common';

export const registerTeam = async ({
  teamId,
  ownerId,
}: InternalRegisterDTO): Promise<MessageResponse> => {
  const createdTeam = await createTeam(teamId, ownerId);

  return {
    status: StatusCodes.CREATED,
    message: `${teamId} 팀이 만들어졌습니다.`,
    data: createdTeam,
  };
};
