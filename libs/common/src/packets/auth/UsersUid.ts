import * as Joi from 'joi';

export const UsersUidSchema = Joi.object({
  uid: Joi.string().required(),
});
