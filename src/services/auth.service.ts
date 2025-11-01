import { otpService, userService } from '.';
import { errorMessage } from '../constants';
import { AuthenticationError, NotFoundError } from '../errors';
import { SignInDto, VerifyUserDto } from '../interfaces';
import { comparePassword } from '../utils/hashPassword';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { generateOTP } from '../utils/otp';
import { sendOtp } from './email.service';

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
