import { NextFunction, Request, Response } from 'express';
import { authService, userService } from '../services';
import { UserRole } from '../enums';
import { BadRequestError } from '../errors';
import { errorMessage, responseMessage } from '../constants';
import { apiResponse } from '../utils/apiResponse';
import { CreateUserDto, SignInDto, VerifyUserDto } from '../interfaces';
import crypto from 'crypto';
import { UserDto } from '../mapping/dtos';
import env from '../config/env';
import passport from 'passport';

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
    res.status(201).json(apiResponse(201, responseMessage.SIGNUP_SUCCESS, newUser));
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
  req: Request<{}, any, SignInDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await authService.signIn(req.body);
    res.json(
      data
        ? apiResponse(200, responseMessage.SIGNIN_SUCCESS, data)
        : apiResponse(200, responseMessage.OTP_SENT),
    );
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
  req: Request<{}, any, VerifyUserDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await authService.verifyUser(req.body);
    res.json(apiResponse(200, responseMessage.SIGNIN_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

export const initiateOAuth2 = (provider: 'google' | 'facebook') => {
  return async (
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
    req: Request<{}, any, any, { role: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const role = req.query.role as UserRole;
      if (!Object.values(UserRole).includes(role)) {
        throw new BadRequestError(errorMessage.INVALID_ROLE);
      }

      // Generate state and store role
      const state = crypto.randomBytes(32).toString('hex');
      await authService.storeRole(state, role);

      passport.authenticate(provider, {
        scope: provider === 'google' ? ['profile', 'email'] : ['email'],
        session: false,
        state: state,
      })(req, res, next);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };
};

export const oAuth2Callback = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserDto & { provider: 'google' | 'facebook' };

    if (!user || !user.id) {
      throw new Error('User authentication failed');
    }

    const code = authService.generateTempCode(user, user.provider);

    res.redirect(`${env.SUCCESS_REDIRECT_URI}?code=${code}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const errorRedirect = env.ERROR_REDIRECT_URI || `${env.APP_URL}/error`;
    res.redirect(`${errorRedirect}?error=${encodeURIComponent(err.message)}`);
  }
};

export const exchangeToken = async (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, error: 'Code required' });

  try {
    const decodedCode = decodeURIComponent(code);
    const result = await authService.exchangeCode(decodedCode);
    res.json(apiResponse(200, responseMessage.SIGNIN_SUCCESS, result));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res
      .status(err.message.includes('expired') ? 410 : 400)
      .json({ success: false, error: err.message });
  }
};
