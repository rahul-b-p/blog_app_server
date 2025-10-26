import { CreateUserDto, UserDto } from "../dtos";
import { UserRole } from "../enums";
import { BadRequestError, ConflictError, InternalServerError } from "../errors";
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
    logger.error(`Error creating user: ${error.message}`);

    // Handle Mongoose ValidationError (for required, enum, etc.)
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => {
        if (err.kind === "required") {
          return `Field '${err.path}' is required.`;
        } else if (err.kind === "enum") {
          return `Field '${err.path}' must be one of: ${Object.values(
            UserRole
          ).join(", ")}.`;
        }
        return err.message;
      });
      throw new BadRequestError(
        `Validation failed: ${validationErrors.join(", ")}`
      );
    }

    // Handle MongoServerError for unique constraint violations
    if (error.name === "MongoServerError" && error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      throw new ConflictError(
        `Field '${field}' with value '${value}' already exists.`
      );
    }

    // Fallback for other errors
    throw new InternalServerError(`Failed to create user: ${error.message}`);
  }
};
