import { UserRole } from "../../enums";

export class UserDto {
  id!: string;
  fullName!: string;
  username!: string;
  email!: string;
  role!: UserRole;
  verified!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}