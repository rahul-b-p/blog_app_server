import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { CustomError } from "../errors";


export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    logger.warn(err.message);
    return res.status(err.statusCode).json(err.serialize());
  }

  logger.error(err.message);
  res.status(500).json({ status: "error", message: "Something went wrong" });
};
