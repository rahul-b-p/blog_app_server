import crypto from 'crypto';
import { OAuth2Token } from '../interfaces/oauth.interface';
import { AuthenticationError, CustomError } from '../errors';
import env from '../config/env';
import { errorMessage } from '../constants';
import { logger } from './logger';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const TOKEN_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Derives a key from the secret to ensure it's the correct length (32 bytes for aes-256)
 */
const getKey = (): Buffer => {
  return crypto.scryptSync(env.TEMP_CODE_SECRET, 'salt', 32);
};

export const createOAuth2Token = (payload: Omit<OAuth2Token, 'createdAt'>): string => {
  const dataWithTimestamp: OAuth2Token = {
    ...payload,
    createdAt: Date.now(),
  };

  const payloadString = JSON.stringify(dataWithTimestamp);
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(payloadString, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Prepend IV to encrypted data (IV doesn't need to be secret)
  return iv.toString('hex') + ':' + encrypted;
};

export const verifyOAuth2Token = (code: string): Omit<OAuth2Token, 'createdAt'> => {
  try {
    // Handle URL-encoded codes
    const decodedCode = code.includes('%') ? decodeURIComponent(code) : code;

    // Split IV and encrypted data
    const parts = decodedCode.split(':');
    if (parts.length !== 2) {
      throw new AuthenticationError(errorMessage.INVALID_OAUTH_CODE);
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedData = parts[1];

    const key = getKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const payload: OAuth2Token = JSON.parse(decrypted);
    const currentTime = Date.now();
    const codeAge = currentTime - (payload.createdAt || 0);

    if (codeAge > TOKEN_EXPIRY_MS) {
      throw new AuthenticationError(errorMessage.OAUTH_CODE_EXPIRED);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, ...result } = payload;
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error('Token verification error:', error.message);
    throw new AuthenticationError(errorMessage.MALFORMED_OAUTH_CODe);
  }
};
