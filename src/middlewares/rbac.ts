import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, ForbiddenError } from '../errors';
import { errorMessage } from '../constants';
import { UserRole } from '../enums';

export const verifyRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.role) {
      throw new AuthenticationError();
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError(errorMessage.INVALID_ACCESS);
    }

    next();
  };
};
