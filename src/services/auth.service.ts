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
    //proccess in back ground
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
  await redis.set(key, role, 'EX', STATE_TTL);
};

export const consumeRole = async (state: string): Promise<UserRole> => {
  console.log(state);
  const key = REDIS_PREFIX + state;
  const role = await redis.get(key);
  console.log(role);

  if (!role) {
    throw new AuthenticationError(errorMessage.INVALI_OAUTH);
  }

  await redis.del(key); // One-time use
  logger.debug(`Consumed role ${role} from Redis`);
  return role as UserRole;
};

const getUserInfo = (profile: OAuthProfile, provider: 'google' | 'facebook') => {
  const email = profile.emails?.[0]?.value;
  if (!email) throw new InternalServerError(errorMessage.EMAIL_REQUIRED_IN_OAUTH);

  const username =
    provider === 'google'
      ? profile.displayName || email.split('@')[0]
      : `${profile.name?.givenName} ${profile.name?.familyName}`.trim() || email.split('@')[0];

  const fullName = profile.name
    ? profile.name.givenName + ' ' + profile.name.givenName
    : provider + 'user';

  return { email, username, fullName };
};

export const findOrCreateUser = async (
  profile: OAuthProfile,
  provider: 'google' | 'facebook',
  role: UserRole,
): Promise<UserDto> => {
  const { email, username, fullName } = getUserInfo(profile, provider);

  const user = await userService.findUserByEmail(email);
  if (user) return userService.findUserById(user._id.toString());

  // Generate unique username
  let finalUsername = username;
  let i = 1;
  while (await userService.findUserByUsername(finalUsername)) {
    finalUsername = `${username}_${i++}`;
  }

  const newUser = await userService.createUser({
    email,
    username: finalUsername,
    password: crypto.randomBytes(16).toString('hex'), // dummy
    role,
    verified: true,
    fullName,
  });

  return newUser;
};

export const generateTempCode = (user: UserDto, provider: 'google' | 'facebook'): string => {
  return createOAuth2Token({
    userId: user.id,
    email: user.email,
    role: user.role,
    provider,
  });
};

export const exchangeCode = async (code: string) => {
  const payload = verifyOAuth2Token(code);
  const user = await userService.findUserById(payload.userId, true);

  return {
    accessToken: generateAccessToken(user.id, user.role),
    refreshToken: generateRefreshToken(user.id),
  };
};
