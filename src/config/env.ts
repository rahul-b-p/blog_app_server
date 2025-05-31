import { config } from "dotenv";
import Joi from "joi";
import { errorMessage } from "../constants";
import { logger } from "../utils/logger";

config();

interface EnvVars {
  MONGODB_URI: string;
  PORT: number;
  ELASTIC_URI: string;
}

const envSchema = Joi.object<EnvVars>({
  MONGODB_URI: Joi.string().uri().required(),
  PORT: Joi.number().integer().min(1).max(65535).required(),
  ELASTIC_URI: Joi.string().uri().required(),
})
  .options({ allowUnknown: true })
  .prefs({ convert: true });

const { error, value } = envSchema.validate(process.env);

if (error) {
  logger.error(errorMessage.INVALID_ENV + "\n" + error.message);
  process.exit(1);
}

export const env: EnvVars = value;
