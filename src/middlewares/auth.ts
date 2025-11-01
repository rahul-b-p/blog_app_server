import { NextFunction, Response } from 'express';
import { ExtendedRequest } from '../interfaces/';
import { AuthenticationError } from '../errors';
import { errorMessage } from '../constants';
import { verifyAccessToken } from '../utils/jwt';
import { validateObjectId } from '../validations';
import { userService } from '../services';

export const authenticateUser = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AuthenticationError(errorMessage.NO_TOKEN);
    }

    const payload = verifyAccessToken(token);
    if (!payload || validateObjectId(payload.id)) {
      throw new AuthenticationError(errorMessage.INVALID_TOKEN);
    }

    const user = await userService.findUserById(payload.id, false);
    req.user = {
      id: user.id,
      role: user.role,
    };
    next();
  } catch (error) {
    next(error);
  }
};
