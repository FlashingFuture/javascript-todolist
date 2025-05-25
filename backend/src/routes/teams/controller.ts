import { Request, Response } from 'express';
import { createTeam } from './service/createTeam';
import { getTeams } from './service/getTeams';
import { deleteTeam } from './service/deleteTeam';
import { getTeamMembers } from './service/getTeamMembers';
import { registerMember } from './service/registerMember';
import { deleteTeamMember } from './service/deleteTeamMember';
import { AuthenticatedRequest } from '@/types/common';
import {
  InternalRegisterDTO,
  GetTeamsDTO,
  DeleteTeamDTO,
  RegisterMemberDTO,
  GetTeamMembersDTO,
  DeleteTeamMemberDTO,
} from './types';

export const createTeamController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teamId } = req.body;
  const ownerId = (req as AuthenticatedRequest).user!.id;

  const dto: InternalRegisterDTO = { teamId, ownerId };
  const result = await createTeam(dto);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const getTeamsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user!.id;

  const dto: GetTeamsDTO = { userId };
  const result = await getTeams(dto);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const deleteTeamController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ownerId = (req as AuthenticatedRequest).user!.id;
  const teamId = Number(req.params.teamId);

  const dto: DeleteTeamDTO = { teamId, ownerId };
  const result = await deleteTeam(dto);

  res.status(200).json({ message: `${result.teamName} 팀이 삭제되었습니다.` });
};

export const getTeamMembersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requesterId = (req as AuthenticatedRequest).user!.id;
  const teamId = Number(req.params.teamId);

  const dto: GetTeamMembersDTO = { teamId, requesterId };
  const result = await getTeamMembers(dto);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const registerMemberController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ownerId = (req as AuthenticatedRequest).user!.id;
  const teamId = Number(req.params.teamId);
  const { newMemberId } = req.body;

  const dto: RegisterMemberDTO = { teamId, ownerId, newMemberId };
  const result = await registerMember(dto);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const deleteTeamMemberController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ownerId = (req as AuthenticatedRequest).user!.id;
  const teamId = Number(req.params.teamId);
  const { memberId } = req.body;

  const dto: DeleteTeamMemberDTO = { teamId, ownerId, memberId };
  const result = await deleteTeamMember(dto);

  res.status(200).json({
    message: `${result.userName}이 ${result.teamName}에서 삭제되었습니다.`,
  });
};
