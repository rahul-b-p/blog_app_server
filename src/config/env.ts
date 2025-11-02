import { config } from 'dotenv';
import Joi from 'joi';
import { errorMessage } from '../constants';
import { logger } from '../utils/logger';
import { fullnameSchema, passwordSchema, usernameSchema } from '../schemas';
import { expirationSchema, secretKeySchema } from '../schemas/jwt.schema';

config();

interface EnvVars {
  MONGODB_URI: string;
  PORT: number;
  ELASTIC_URI: string;
  HASH_SALT: number;
  ADMIN_USERNAME: string;
  ADMIN_EMAIL: string;
  ADMIN_FULLNAME: string;
  ADMIN_PASSWORD: string;
  REFRESH_SECRET: string;
  REFRESH_EXPIRE_IN: string;
  ACCESS_SECRET: string;
  ACCESS_EXPIRE_IN: string;
  MAIL_APP_USER: string;
  MAIL_APP_PASS: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  APP_URL: string;
  SUCCESS_REDIRECT_URI: string;
  ERROR_REDIRECT_URI: string;
}

const envSchema = Joi.object<EnvVars>({
  MONGODB_URI: Joi.string().uri().required(),
  PORT: Joi.number().integer().min(1).max(65535).required(),
  ELASTIC_URI: Joi.string().uri().required(),
  HASH_SALT: Joi.number().integer().min(1).max(10).required(),
  ADMIN_USERNAME: usernameSchema.default('admin').optional(),
  ADMIN_FULLNAME: fullnameSchema.default('Admin').optional(),
  ADMIN_PASSWORD: passwordSchema.default('Admin@123').optional(),
  ADMIN_EMAIL: Joi.string().email().required(),
  REFRESH_SECRET: secretKeySchema.required(),
  REFRESH_EXPIRE_IN: expirationSchema.required(),
  ACCESS_SECRET: secretKeySchema.required(),
  ACCESS_EXPIRE_IN: expirationSchema.required(),
  MAIL_APP_USER: Joi.string().email().required(),
  MAIL_APP_PASS: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  FACEBOOK_APP_ID: Joi.string().required(),
  FACEBOOK_APP_SECRET: Joi.string().required(),
  APP_URL: Joi.string().required(),
  SUCCESS_REDIRECT_URI: Joi.string().uri().default('http://localhost:3000'),
  ERROR_REDIRECT_URI: Joi.string().uri().default('http://localhost:3000'),
})
  .options({ allowUnknown: true })
  .prefs({ convert: true });

const { error, value } = envSchema.validate(process.env);

if (error) {
  logger.error(errorMessage.INVALID_ENV + '\n' + error.message);
  process.exit(1);
}

export default value as EnvVars;
