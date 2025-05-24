export interface RegisterTeamDTO {
  teamId: string;
}

export interface InternalRegisterDTO extends RegisterTeamDTO {
  ownerId: number;
}

export interface GetTeamsDTO {
  userId: number;
}

export interface DeleteTeamDTO {
  teamId: number;
  ownerId: number;
}

export interface RegisterMemberDTO {
  teamId: number;
  ownerId: number;
  newMemberId: string;
}

export interface DeleteTeamMemberDTO {
  teamId: number;
  ownerId: number;
  memberId: number;
}
