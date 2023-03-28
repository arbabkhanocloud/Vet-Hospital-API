import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).send("Something failed.");
};
