import { Document, ObjectId } from 'mongoose';
import { UserRole } from '../enums';

export interface IUser extends Document {
  _id: ObjectId;
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  verified: boolean;
  twoFA: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdaetUserDto {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  verified?: boolean;
  twoFA?: boolean;
}

export interface SignInDto {
  username: string;
  password: string;
}

export interface VerifyUserDto {
  username: string;
  otp: string;
}
