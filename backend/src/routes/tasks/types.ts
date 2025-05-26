export interface CompleteUserTaskDTO {
  taskId: number;
  userId: number;
}

export interface CompleteTeamTaskDTO {
  taskId: number;
  teamId: number;
  userId: number;
}

export interface CreateUserTaskDTO {
  userId: number;
  contents: string;
  duration: number;
}

export interface CreateTeamTaskDTO {
  teamId: number;
  userId: number;
  contents: string;
  duration: number;
}

export interface DeleteUserTaskDTO {
  taskId: number;
  userId: number;
}

export interface DeleteTeamTaskDTO {
  taskId: number;
  teamId: number;
  userId: number;
}

export interface GetUserTaskDTO {
  userId: number;
}

export interface GetTeamTaskDTO {
  teamId: number;
}

export interface UpdateUserTaskDTO {
  taskId: number;
  contents: string;
  duration: number;
  userId: number;
}

export interface UpdateTeamTaskDTO {
  taskId: number;
  contents: string;
  duration: number;
  teamId: number;
  userId: number;
}
