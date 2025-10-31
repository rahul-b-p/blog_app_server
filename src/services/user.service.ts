import { CreateUserDto } from "../interfaces";
import { mapper } from "../mapping";
import { UserDto } from "../mapping/dtos";
import { User } from "../models";
import { hashPassword } from "../utils/hashPassword";
import { logger } from "../utils/logger";
import { handleMongoDBError } from "../utils/mongo-error";

export const findUserByUsername = async (username: string) => {
  logger.debug(`Finding user by username: ${username}`);

  try {
    return await User.findOne({ username }).exec();
  } catch (error: any) {
    logger.error(error.message);
    handleMongoDBError(error);
    throw error;
  }
};

export const createUser = async (user: CreateUserDto): Promise<UserDto> => {
  logger.debug("Creating new User");
  const { password, ...userData } = user;
  const newUser = new User(userData);

  newUser.passwordHash = await hashPassword(password);

  try {
    const savedUser = await newUser.save();
    return mapper.map(savedUser, User, UserDto);
  } catch (error: any) {
    logger.error(`Error creating user: ${error.message}`);
    handleMongoDBError(error);
    throw error;
  }
};
