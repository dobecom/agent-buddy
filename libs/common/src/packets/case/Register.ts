import * as Joi from 'joi';

export const RegisterSchema = Joi.object({
  number: Joi.string().max(20).trim().required(),
  title: Joi.string().max(100).trim().required(),
});
