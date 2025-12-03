import { BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';
import { ErrorCodes } from '../code/error/error.code';

export const validateSchema = async (schema: Joi.ObjectSchema, data) => {
  try {
    const extended = await schema.append({
      createdBy: Joi.string().optional().allow(null, ''),
      updatedBy: Joi.string().optional().allow(null, ''),
    });
    await extended.validateAsync(data);
  } catch (err) {
    throw new BadRequestException({ code: ErrorCodes.BR001 });
  }
};
