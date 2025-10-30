import { Document, ObjectId } from "mongoose";
import { UserRole } from "../enums";

export interface IUser extends Document{
  _id:ObjectId
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  verified:boolean;
  createdAt:Date;
  updatedAt:Date;
}
