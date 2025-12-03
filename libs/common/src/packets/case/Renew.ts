import * as Joi from 'joi';

export const RenewSchema = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string().max(100).trim().required(),
});
