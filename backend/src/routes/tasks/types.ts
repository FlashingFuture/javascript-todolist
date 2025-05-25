export interface CreateTaskDTO {
  userId: number;
  teamId?: number;
  contents: string;
  duration: number;
}

export interface GetTasksDTO {
  userId: number;
  teamId?: number;
}

export interface UpdateTaskDTO {
  taskId: number;
  userId: number;
  teamId?: number;
  contents: string;
  duration: number;
}

export interface DeleteTaskDTO {
  taskId: number;
  userId: number;
  teamId?: number;
}

export interface CompleteTaskDTO {
  taskId: number;
  userId: number;
  teamId?: number;
}
