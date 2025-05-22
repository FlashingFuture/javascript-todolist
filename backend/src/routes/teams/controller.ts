import { Request, Response } from 'express';
import { registerTeam as registerTeamService } from './service/registerTeam';
import { getTeams } from './service/getTeams';
import { deleteTeam as deleteTeamService } from './service/deleteTeam';
import { getTeamMembers as getTeamMembersService } from './service/getTeamMembers';
import { registerMember as registerMemberService } from './service/registerMember';
import { deleteTeamMember as deleteTeamMemberService } from './service/deleteTeamMember';
import { AuthenticatedRequest } from '@/types/common';
import { InternalRegisterDTO } from './types';

export const registerTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teamId } = req.body;
  const ownerId = (req as AuthenticatedRequest).user!.id;

  const dto: InternalRegisterDTO = { teamId, ownerId };
  const result = await registerTeamService(dto);

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
  return;
};

export const getUsersTeams = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const result = await getTeams({ userId });

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
  return;
};

export const deleteTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = (req as AuthenticatedRequest).user!.id;
  const teamId = Number(req.params.teamId);

  const result = await deleteTeamService({ teamId, ownerId: id });

  res.status(200).json({ message: `${result.teamName} 팀이 삭제되었습니다.` });
};

export const getTeamMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requesterId = (req as AuthenticatedRequest).user!.id;
  const teamId = Number(req.params.teamId);

  const result = await getTeamMembersService({ teamId, requesterId });

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const registerMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ownerId = (req as AuthenticatedRequest).user!.id;
  const teamId = Number(req.params.teamId);
  const { newMemberId } = req.body;

  const result = await registerMemberService({ teamId, ownerId, newMemberId });

  res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const deleteTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ownerId = (req as AuthenticatedRequest).user!.id;
  const teamId = Number(req.params.teamId);
  const { memberId } = req.body;

  const result = await deleteTeamMemberService({ teamId, ownerId, memberId });

  res.status(200).json({
    message: `${result.userName}이 ${result.teamName}에서 삭제되었습니다.`,
  });
  return;
};
