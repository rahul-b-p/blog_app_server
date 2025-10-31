import { sign, verify } from 'jsonwebtoken';
import env from '../../config/env';
import { StringValue, TokenPayload } from '../../interfaces/jwt.interface';

export const generateRefreshToken = (id: string): string => {
  return sign({ id }, env.ACCESS_SECRET, {
    expiresIn: env.ACCESS_EXPIRE_IN as StringValue,
  });
};

export const verifyRefreshToken = (token: string): Omit<TokenPayload, 'role'> => {
  return verify(token, env.ACCESS_SECRET) as Omit<TokenPayload, 'role'>;
};
