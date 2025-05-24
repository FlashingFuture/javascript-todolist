import { Request } from 'express';

export interface MessageResponse<T = any> {
  status: number;
  message: string;
  data?: T;
}

export type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    userId: string;
  };
};
