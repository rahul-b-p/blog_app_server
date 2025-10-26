import { Document } from "mongoose";
import { UserRole } from "../enums";

export interface IUser extends Document{
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}
