import * as Joi from 'joi';

export const ViewSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
