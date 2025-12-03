import * as Joi from 'joi';

export const InitPasswordSchema = Joi.object({
  uid: Joi.string().required(),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@$!%*#?&]).{8,}$/)
    .messages({
      'string.empty': '비밀번호를 입력해주세요.',
      'string.pattern.base': '문자, 숫자, 특수기호가 포함되어야합니다.',
      'string.min': '비밀번호는 8자리 이상이어야 합니다.',
    }),
});
