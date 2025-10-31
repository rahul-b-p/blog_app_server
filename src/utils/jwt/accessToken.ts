import { sign, verify } from 'jsonwebtoken';
import env from '../../config/env';
import { StringValue, TokenPayload } from '../../interfaces/jwt.interface';

export const generateAccessToken = (id: string, role: string): string => {
  return sign({ id, role }, env.ACCESS_SECRET, {
    expiresIn: env.ACCESS_EXPIRE_IN as StringValue,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return verify(token, env.ACCESS_SECRET) as TokenPayload;
};
