export interface RegisterDTO {
  userId: number;
  teamId?: number;
  contents: string;
  duration: number;
}

export interface SelectTaskDTO {
  userId: number;
  teamId?: number;
}
