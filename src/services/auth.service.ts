import { userService } from ".";
import { errorMessage } from "../constants";
import { AuthenticationError, NotFoundError } from "../errors";
import { SignInDto } from "../interfaces";
import { comparePassword } from "../utils/hashPassword";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

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

  return {
    accessToken: generateAccessToken(user._id.toString(), user.role),
    refreshToken: generateRefreshToken(user._id.toString()),
  };
};
