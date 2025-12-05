import * as Joi from 'joi';

export const RegisterCasesSchema = Joi.object({
  number: Joi.string().max(20).required(),
  productFamily: Joi.string().max(100).required(),
  productName: Joi.string().max(100).required(),
  productVersion: Joi.string().max(100).optional().allow(null, ''),

  category: Joi.string().max(100).optional().allow(null, ''),
  subCategory: Joi.string().max(100).optional().allow(null, ''),

  title: Joi.string().max(100).required(),

  status: Joi.string()
    .valid('OPEN', 'PROCESSING', 'PROCESSED', 'CLOSE')
    .optional(),

  createdBy: Joi.string().max(30).optional().allow(null, ''),
  updatedBy: Joi.string().max(30).optional().allow(null, ''),
});