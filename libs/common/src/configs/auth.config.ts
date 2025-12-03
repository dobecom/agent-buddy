import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  sessionLimit: parseInt(process.env.SESSION_LIMIT || '', 10) || 5,
  signOutAuto: parseInt(process.env.SIGNOUT_AUTO || '', 10) || 3600,
  sign: {
    failLimit: process.env.SIGN_FAIL_LIMIT || 5,
    secret: process.env.SIGN_SECRET || 'ABCDEF0123456789',
    expires: process.env.SIGN_EXPIRES || '3600', // 1 hour
  },
  resign: {
    secret: process.env.RESIGN_SECRET || 'ABCDEF0123456789',
    expires: process.env.RESIGN_EXPIRES || '864000', // 10 days
  },
  verify: {
    expires: process.env.VERIFY_EXPIRES || '600', // 10 min
  },
}));
