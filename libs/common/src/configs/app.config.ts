import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.ENVIRONMENT || 'prd',
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT as string, 10) || 3000,
  adminPublicUrl: process.env.ADMIN_PUBLIC_URL || 'http://localhost:3000',
  bizPublicUrl: process.env.BIZ_PUBLIC_URL || 'http://localhost:3000',
  userPublicUrl: process.env.USER_PUBLIC_URL || 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL || 'log',
  corsOrigins: (process.env.CORS_ORIGINS as string).split('||') || [],
  encKey: process.env.ENC_KEY || '1234567890abcdefghijklmnopqrstuv',
  encIv: process.env.ENC_IV || '1234567890zyxwvu',
  AppsTimeout: parseInt(process.env.APPS_TIMEOUT as string, 10) || 5000,
}));
