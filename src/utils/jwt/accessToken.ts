import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import env from '../../config/env';
import { StringValue, TokenPayload } from '../../interfaces';
import { errorMessage } from '../../constants';
import { AuthenticationError } from '../../errors';

export const generateAccessToken = (id: string, role: string): string => {
  return sign({ id, role }, env.ACCESS_SECRET, {
    expiresIn: env.ACCESS_EXPIRE_IN as StringValue,
  });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return verify(token, env.ACCESS_SECRET) as TokenPayload;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new AuthenticationError(errorMessage.INVALID_TOKEN);
    }
    return null;
  }
};
