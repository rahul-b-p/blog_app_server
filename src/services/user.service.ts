import { errorMessage } from '../constants';
import { AuthenticationError, NotFoundError } from '../errors';
import { CreateUserDto, UpdaetUserDto } from '../interfaces';
import { mapper } from '../mapping';
import { UserDto } from '../mapping/dtos';
import { User } from '../models';
import { hashPassword } from '../utils/hashPassword';
import { logger } from '../utils/logger';
import { handleMongoDBError } from '../utils/mongo-error';

export const findUserByUsername = async (username: string) => {
  logger.debug(`Finding user by username: ${username}`);

  try {
    return await User.findOne({ username }).exec();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(error.message);
    handleMongoDBError(error);
    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  logger.debug(`Finding user by email: ${email}`);
  try {
    return await User.findOne({ email }).exec();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(`Error finding user by email: ${error.message}`);
    throw error;
  }
};

export const findUserById = async (id: string, authCheck: boolean = false): Promise<UserDto> => {
  logger.debug(`Finding user by id: ${id}`);
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      if (authCheck) {
        throw new AuthenticationError(errorMessage.USER_NOT_FOUND);
      }
      throw new NotFoundError(errorMessage.USER_NOT_FOUND);
    }
    return mapper.map(user, User, UserDto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(`Error creating user: ${error.message}`);
    handleMongoDBError(error);
    throw error;
  }
};

export const createUser = async (user: CreateUserDto): Promise<UserDto> => {
  logger.debug('Creating new User');
  const { password, ...userData } = user;
  const newUser = new User(userData);

  newUser.passwordHash = await hashPassword(password);

  try {
    const savedUser = await newUser.save();
    return mapper.map(savedUser, User, UserDto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(`Error creating user: ${error.message}`);
    handleMongoDBError(error);
    throw error;
  }
};

export const updateUserById = async (id: string, updateData: UpdaetUserDto) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError(errorMessage.USER_NOT_FOUND);
    }

    Object.assign(user, updateData);
    await user.save();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(`Error updating user: ${error.message}`);
    handleMongoDBError(error);
    throw error;
  }
};
