import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { BadRequestError } from '../errors';
import { errorMessage } from '../constants';

export const validateReqBody = (schema: Joi.AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      throw new BadRequestError(errorMessage.REQ_PAYLOAD);
    }

    const { error } = schema.options({ allowUnknown: false }).validate(req.body);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    error ? next(new BadRequestError(error.message)) : next();
  };
};
