import { insertTeam } from '../model';
import { InternalRegisterDTO } from '../types';
import { MessageResponse } from '@/types/common';
import { Pool } from 'mysql2/promise';

export const createTeam = async (
  db: Pool,
  { teamId, ownerId }: InternalRegisterDTO
): Promise<MessageResponse> => {
  const createdTeam = await insertTeam(db, teamId, ownerId);

  return {
    status: 201,
    message: `${teamId} 팀이 만들어졌습니다.`,
    data: createdTeam,
  };
};
