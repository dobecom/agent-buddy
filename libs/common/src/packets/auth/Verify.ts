import * as Joi from 'joi';

export const VerifySchema = Joi.object({
  verifyKey: Joi.string().trim().required(),
});
