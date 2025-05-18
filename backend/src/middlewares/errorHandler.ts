import { Request, Response, NextFunction } from "express";
import { sendErrorResponse } from "@/utils/sendErrorResponse";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  sendErrorResponse(res, err);
};
