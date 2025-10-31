import Joi from "joi";
import {
  fullnameSchema,
  passwordSchema,
  usernameSchema,
} from "./credantials.schema";

export const signUpSchema = Joi.object({
  username: usernameSchema.required(),
  password: passwordSchema.required(),
  fullName: fullnameSchema.required(),
  email: Joi.string().email().required(),
});

export const signInSchema = Joi.object({
  username: usernameSchema.required(),
  password: passwordSchema.required(),
});
