import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST || '127.0.0.1',
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
}));
