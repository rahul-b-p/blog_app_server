import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { CustomError } from '../errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    logger.warn(err.message);
    return res.status(err.statusCode).json(err.serialize());
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON format. Please check your request body.',
      statusCode: 400,
    });
  }

  logger.error(err.message);
  res.status(500).json({ status: 'error', message: 'Something went wrong' });
};
