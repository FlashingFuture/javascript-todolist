import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validateRequest: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      message: "유효성 검사 오류",
      errors: errors.array(),
    });
    return;
  }
  next();
};
