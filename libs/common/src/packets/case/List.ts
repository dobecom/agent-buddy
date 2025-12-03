import * as Joi from 'joi';

export const ListSchema = Joi.object({
  page: Joi.number().optional().allow(null),
});
