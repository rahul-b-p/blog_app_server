import { NextFunction, Response } from 'express';
import { UserRole } from '../enums';
import { ExtendedRequest } from '../interfaces/request.interface';
import { ForbiddenError } from '../errors';
import { errorMessage } from '../constants';

export const verifyRole = (...roles: UserRole[]) => {
  return (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      throw new ForbiddenError(errorMessage.INVALID_ACCESS);
    }

    next();
  };
};
