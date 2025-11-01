import crypto from 'crypto';

export const generateOTP = (
  length: number = 6,
  type: 'numeric' | 'alphanumeric' = 'numeric',
): string => {
  const numericChars = '0123456789';
  const alphaNumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const charset = type === 'numeric' ? numericChars : alphaNumericChars;

  let otp = '';
  const bytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    otp += charset[bytes[i] % charset.length];
  }

  return otp;
};
