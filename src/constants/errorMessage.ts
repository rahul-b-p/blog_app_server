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

  // User
  USERNAME_EXISTS: 'User Already Exist with given username',
  INVALID_ROLE: 'Invalid role',
  USERNAME_NOT_EXISTS: 'No user exist with provided username',
  INVALID_PASSWORD: 'Invalid password',
};
