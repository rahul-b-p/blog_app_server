import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(
    `The requested resource ${req.originalUrl} was not found on the server`,
  );
  next(error);
};
