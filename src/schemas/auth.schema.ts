import Joi from "joi";
import {
  fullnameSchema,
  passwordSchema,
  usernameSchema,
} from "./credantials.schema";

export const signUpSchema = Joi.object({
  password: passwordSchema.required(),
  fullName: fullnameSchema.required(),
  username: usernameSchema.required(),
  email: Joi.string().email().required(),
});
