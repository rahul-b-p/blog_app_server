import { UserRole } from '../enums';
import { OAuthUser } from '../interfaces';

declare global {
  namespace Express {
    interface User extends OAuthUser {
      id?: string;
      role?: UserRole;
    }
  }
}

export {};
