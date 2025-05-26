import { StatusCodes } from 'http-status-codes';
import { MessageResponse } from '@/types/common';
import { GetTeamsDTO } from '../types';
import { selectTeamsByUserId } from '../model';
import { connection } from '@/database/mariadb';

export const getTeams = async ({
  userId,
}: GetTeamsDTO): Promise<MessageResponse> => {
  const teamList = await selectTeamsByUserId(connection, userId);
  return {
    status: StatusCodes.OK,
    message: `조회 성공`,
    data: teamList,
  };
};
