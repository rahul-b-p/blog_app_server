import Joi from "joi";

/**
 * Schema for ADMIN_USERNAME
 * - Only lowercase letters, numbers, underscore, and dot allowed
 * - Must start with a lowercase letter
 * - Minimum 1 character
 */
export const usernameSchema = Joi.string()
  .pattern(/^[a-z][a-z0-9_.]*$/)
  .min(1)
  .required()
  .messages({
    "string.pattern.base":
      "Username must start with a lowercase letter and contain only lowercase letters, numbers, underscores, or dots.",
    "string.min": "Username must be at least 1 character long.",
    "string.empty": "Username is required.",
  });

/**
 * Schema for fullName
 * - Only alphabets and single spaces allowed
 * - No leading/trailing spaces or multiple consecutive spaces
 * - Minimum 1 character
 */
export const fullnameSchema = Joi.string()
  .pattern(/^[a-zA-Z]+( [a-zA-Z]+)*$/)
  .min(1)
  .required()
  .messages({
    "string.pattern.base":
      "Full name must contain only alphabets and single spaces between words.",
    "string.min": "Full name must be at least 1 character long.",
    "string.empty": "Full name is required.",
  });

/**
 * Schema for ADMIN_PASSWORD
 * - Minimum 8 characters
 * - At least one uppercase letter, one lowercase letter, one number, and one special character
 */
export const passwordSchema = Joi.string()
  .min(8)
  .pattern(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  )
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
    "string.min": "Password must be at least 8 characters long.",
    "string.empty": "Password is required.",
  });
