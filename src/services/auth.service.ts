import { otpService, userService } from '.';
import redis from '../config/redis';
import { errorMessage } from '../constants';
import { UserRole } from '../enums';
import { AuthenticationError, InternalServerError, NotFoundError } from '../errors';
import { OAuthProfile, SignInDto, VerifyUserDto } from '../interfaces';
import { UserDto } from '../mapping/dtos';
import { comparePassword } from '../utils/hashPassword';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { logger } from '../utils/logger';
import { createOAuth2Token, verifyOAuth2Token } from '../utils/oauth2';
import { generateOTP } from '../utils/otp';
import { sendOtp } from './email.service';
import crypto from 'crypto';

const REDIS_PREFIX = 'oauth:state:';
const STATE_TTL = 600; // 10 minutes

export const signIn = async (userData: SignInDto) => {
  const { password, username } = userData;

  const user = await userService.findUserByUsername(username);
  if (!user) {
    throw new NotFoundError(errorMessage.USERNAME_NOT_EXISTS);
  }

  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new AuthenticationError(errorMessage.INVALID_PASSWORD);
  }

  if (!user.verified || user.twoFA) {
    const otp = generateOTP();
    await otpService.createOtp(user._id.toString(), otp);
    // Process in background
    sendOtp(user.email, user.username, otp);
    return null;
  }

  return {
    accessToken: generateAccessToken(user._id.toString(), user.role),
    refreshToken: generateRefreshToken(user._id.toString()),
  };
};

export const verifyUser = async (verifyData: VerifyUserDto) => {
  const { otp, username } = verifyData;

  const user = await userService.findUserByUsername(username);
  if (!user) {
    throw new NotFoundError(errorMessage.USERNAME_NOT_EXISTS);
  }

  const userOtp = await otpService.getOtpByUser(user._id.toString());
  if (!userOtp) {
    throw new AuthenticationError(errorMessage.OTP_EXPIRED);
  }

  if (otp !== userOtp.otp) {
    throw new AuthenticationError(errorMessage.INVALID_OTP);
  }

  otpService.deleteOtpById(userOtp._id.toString());

  if (!user.verified) {
    await userService.updateUserById(user._id.toString(), { verified: true });
  }

  return {
    accessToken: generateAccessToken(user._id.toString(), user.role),
    refreshToken: generateRefreshToken(user._id.toString()),
  };
};

export const storeRole = async (state: string, role: UserRole) => {
  logger.debug(`Storing role ${role} in Redis for state: ${state}`);
  const key = REDIS_PREFIX + state;

  try {
    await redis.set(key, role, 'EX', STATE_TTL);
    logger.debug(`Successfully stored role in Redis with key: ${key}`);
  } catch (error) {
    logger.error(`Failed to store role in Redis:`, error);
    throw new InternalServerError('Failed to store OAuth state');
  }
};

export const consumeRole = async (state: string): Promise<UserRole> => {
  if (!state) {
    logger.error('State parameter is missing or empty');
    throw new AuthenticationError(errorMessage.INVALI_OAUTH);
  }

  const key = REDIS_PREFIX + state;
  logger.debug(`Attempting to retrieve role from Redis with key: ${key}`);

  try {
    const role = await redis.get(key);
    logger.debug(`Retrieved value from Redis: ${role}`);

    if (!role) {
      logger.error(`No role found in Redis for state: ${state}`);
      throw new AuthenticationError(errorMessage.INVALI_OAUTH);
    }

    // Validate that the role is a valid UserRole
    if (!Object.values(UserRole).includes(role as UserRole)) {
      logger.error(`Invalid role retrieved from Redis: ${role}`);
      throw new AuthenticationError(errorMessage.INVALI_OAUTH);
    }

    // Delete the state (one-time use)
    await redis.del(key);
    logger.debug(`Consumed and deleted role ${role} from Redis`);

    return role as UserRole;
  } catch (error) {
    logger.error(`Error consuming role from Redis:`, error);
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new InternalServerError('Failed to retrieve OAuth state');
  }
};

const getUserInfo = (profile: OAuthProfile, provider: 'google' | 'facebook') => {
  const email = profile.emails?.[0]?.value;
  if (!email) throw new InternalServerError(errorMessage.EMAIL_REQUIRED_IN_OAUTH);

  const username =
    provider === 'google'
      ? profile.displayName || email.split('@')[0]
      : `${profile.name?.givenName} ${profile.name?.familyName}`.trim() || email.split('@')[0];

  // Fix: was concatenating givenName twice
  const fullName = profile.name
    ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim()
    : `${provider}_user`;

  return { email, username, fullName };
};

export const findOrCreateUser = async (
  profile: OAuthProfile,
  provider: 'google' | 'facebook',
  role: UserRole,
): Promise<UserDto> => {
  const { email, username, fullName } = getUserInfo(profile, provider);

  const user = await userService.findUserByEmail(email);
  if (user) {
    logger.debug(`Existing user found for email: ${email}`);
    return userService.findUserById(user._id.toString());
  }

  // Generate unique username
  let finalUsername = username;
  let i = 1;
  while (await userService.findUserByUsername(finalUsername)) {
    finalUsername = `${username}_${i++}`;
  }

  logger.debug(`Creating new user with username: ${finalUsername}`);

  const newUser = await userService.createUser({
    email,
    username: finalUsername,
    password: crypto.randomBytes(16).toString('hex'), // dummy password
    role,
    verified: true, // OAuth users are pre-verified
    fullName,
  });

  return newUser;
};

export const generateTempCode = (user: UserDto, provider: 'google' | 'facebook'): string => {
  logger.debug(`Generating temporary code for user: ${user.id}`);
  return createOAuth2Token({
    userId: user.id,
    email: user.email,
    role: user.role,
    provider,
  });
};

export const exchangeCode = async (code: string) => {
  try {
    const payload = verifyOAuth2Token(code);
    logger.debug(`Exchanging code for user: ${payload.userId}`);

    const user = await userService.findUserById(payload.userId, true);

    return {
      accessToken: generateAccessToken(user.id, user.role),
      refreshToken: generateRefreshToken(user.id),
    };
  } catch (error) {
    logger.error(`Failed to exchange code:`, error);
    throw error;
  }
};
