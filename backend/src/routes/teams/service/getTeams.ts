import { StatusCodes } from 'http-status-codes';
import { MessageResponse } from '@/types/common';
import { GetTeamsDTO } from '../types';
import { selectTeamsByUserId } from '../model';
import { Pool } from 'mysql2/promise';

export const getTeams = async (
  db: Pool,
  { userId }: GetTeamsDTO
): Promise<MessageResponse> => {
  const teamList = await selectTeamsByUserId(db, userId);
  return {
    status: StatusCodes.OK,
    message: `조회 성공`,
    data: teamList,
  };
};
