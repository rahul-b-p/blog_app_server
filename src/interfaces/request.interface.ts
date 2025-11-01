import { Request } from 'express';
import { UserRole } from '../enums';

export interface ExtendedRequest extends Request {
  user: {
    id: string;
    role: UserRole;
  };
}
