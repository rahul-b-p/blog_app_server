import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "../dtos";
import { userService } from "../services";
import { UserRole } from "../enums";
import { BadRequestError } from "../errors";
import { errorMessage, responseMessage } from "../constants";
import { apiResponse } from "../utils/apiResponse";

export const signUp = async (
  req: Request<{ role: string }, any, Omit<CreateUserDto, "role">>,
  res: Response,
  next: NextFunction
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
