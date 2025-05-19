export interface RegisterDTO {
  userId: string;
  password: string;
  rePassword: string;
}

export interface MessageResponse<T = any> {
  status: number;
  message: string;
  data?: T;
}

export type CreatedUser = {
  id: number;
  userId: string;
};
