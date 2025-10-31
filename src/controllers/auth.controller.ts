import { NextFunction, Request, Response } from 'express';
import { authService, userService } from '../services';
import { UserRole } from '../enums';
import { BadRequestError } from '../errors';
import { errorMessage, responseMessage } from '../constants';
import { apiResponse } from '../utils/apiResponse';
import { CreateUserDto, SignInDto } from '../interfaces';

export const signUp = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: Request<{ role: string }, any, Omit<CreateUserDto, 'role'>>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.body;
    const role = req.params.role as UserRole;
    if (!Object.values(UserRole).includes(role)) {
      throw new BadRequestError(errorMessage.INVALID_ROLE);
    }
    const newUser = await userService.createUser({ role, ...user });
    res.json(apiResponse(201, responseMessage.SIGNUP_SUCCESS, newUser));
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
  req: Request<{}, any, SignInDto>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await authService.signIn(req.body);
    res.json(apiResponse(200, responseMessage.SIGNIN_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};
