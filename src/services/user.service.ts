import { CreateUserDto, UserDto } from "../dtos";
import { UserRole } from "../enums";
import { InternalServerError } from "../errors";
import { IUser } from "../interfaces";
import { mapper } from "../mapping";
import { User } from "../models";
import { hashPassword } from "../utils/hashPassword";
import { logger } from "../utils/logger";

export const findUserByUsername = async (
  username: string
): Promise<UserDto | null> => {
  logger.debug(`Finding user by username: ${username}`);

  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return null;
    }
    return mapper.map(user, User, UserDto);
  } catch (error: any) {
    logger.error(error.message);
    throw new InternalServerError(error.message);
  }
};

export const createUser = async (user: CreateUserDto): Promise<UserDto> => {
  logger.debug("Creating new User");

  try {
    const { password, ...userData } = user;
    const newUser = new User(userData);

    newUser.passwordHash = await hashPassword(password);

    const savedUser = await newUser.save();
    return mapper.map(savedUser, User, UserDto);
  } catch (error: any) {
    logger.error(error.message);
    throw new InternalServerError(error.message);
  }
};
