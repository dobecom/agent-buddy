import * as Joi from 'joi';

export const SignUpSchema = Joi.object({
  identifier: Joi.string()
    .trim()
    .required()
    .pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i)
    .messages({
      'string.empty': '이메일을 입력해주세요.',
      'string.pattern.base': '유효하지 않은 이메일입니다.',
    }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@$!%*#?&]).{8,}$/)
    .messages({
      'string.empty': '비밀번호를 입력해주세요.',
      'string.pattern.base': '문자, 숫자, 특수기호가 포함되어야합니다.',
      'string.min': '비밀번호는 8자리 이상이어야 합니다.',
    }),
  firstName: Joi.string().trim().optional().allow(null, ''),
  lastName: Joi.string().trim().optional().allow(null, ''),
  grade: Joi.number().optional().allow(null),
  companyName: Joi.string().trim().optional().allow(null, ''),
  address: Joi.string().trim().optional().allow(null, ''),
  mobile: Joi.string().trim().optional().allow(null, ''),
});
