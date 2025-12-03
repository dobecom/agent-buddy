import * as Joi from 'joi';

export const AuditLogsRegisterSchema = Joi.object({
  details: Joi.string().trim().required(),
});
