import * as Joi from 'joi';

export const ReVerifySchema = Joi.object({
  identifier: Joi.string()
    .trim()
    .required()
    .pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i)
    .messages({
      'string.empty': '이메일을 입력해주세요.',
      'string.pattern.base': '유효하지 않은 이메일입니다.',
    }),
});
