import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { CustomError } from '../errors';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    logger.warn(err.message);
    res.status(err.statusCode).json(err.serialize());
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON format. Please check your request body.',
      statusCode: 400,
    });
    return;
  }

  logger.error(err.message);
  res.status(500).json({ status: 'error', message: 'Something went wrong' });
};
