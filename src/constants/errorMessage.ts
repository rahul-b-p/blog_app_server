export default {
  // Common
  INVALID_ENV: 'Invalid Env',
  REQ_PAYLOAD: 'Request Required a payload',

  // jwt
  SECRET_KEY_MIN_LENGTH: 'Secret key must be at least 16 characters long.',
  SECRET_KEY_MAX_LENGTH: 'Secret key can be up to 64 characters long.',
  SECRET_KEY_ALPHANUMERIC: 'Secret key must be a combination of alphabets and integers.',
  MUST_BE_NUMERIC_STRING: "Must be a numeric string (e.g., '123').",
  INVALID_EXPRATION_STRING:
    "Must be a number followed immediately by a valid unit (e.g., '123Year').",
  INVALID_TOKEN: 'Invald Token',
  NO_TOKEN: 'There is no token provided in the request',

  // User
  USERNAME_EXISTS: 'User Already Exist with given username',
  INVALID_ROLE: 'Invalid role',
  USERNAME_NOT_EXISTS: 'No user exist with provided username',
  INVALID_PASSWORD: 'Invalid password',
  USER_NOT_FOUND: 'User Not found ',
  OTP_EXPIRED: 'OTP Has been expired',
  INVALID_OTP: 'Invalid OTP',
  OTP_NOT_FOUND: 'OTP not Found',
  INVALID_ACCESS: 'User has no access to perform this action',
  EMAIL_NOT_EXISTS: 'Email does not exist',
  INVALID_CREDENTIALS: 'Invalid credentials',
  OAUTH_STATE_EXPIRED: 'OAuth state expired',
  OAUTH_STATE_INVALID: 'Invalid OAuth state',
  AUTHENTICATION_FAILED: 'Authentication failed',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  CODE_EXPIRED: 'Code expired',
  INVALI_OAUTH: 'Invalid or expired OAuth state',
  EMAIL_REQUIRED_IN_OAUTH: 'Email required in Oauth Response',
};
