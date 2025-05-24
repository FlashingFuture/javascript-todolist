export interface RegisterDTO {
  userId: string;
  password: string;
  rePassword: string;
}

export interface LoginDTO {
  userId: string;
  password: string;
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

export type SelectedUser = {
  userId: string;
};
