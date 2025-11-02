import crypto from 'crypto';
import { OAuth2Token } from '../interfaces/oauth.interface';
import { BadRequestError } from '../errors';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Derives a key from the secret to ensure it's the correct length (32 bytes for aes-256)
 */
const getKey = (): Buffer => {
  return crypto.scryptSync(process.env.TEMP_CODE_SECRET!, 'salt', 32);
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
    // Split IV and encrypted data
    const parts = code.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid code format');
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

    if (codeAge > 5000) {
      throw new BadRequestError('Code expired');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, ...result } = payload;
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === 'Code expired') throw error;
    throw new Error('Invalid or malformed code');
  }
};
