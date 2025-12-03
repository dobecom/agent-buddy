import { registerAs } from '@nestjs/config';

export default registerAs('mq', () => ({
  host: process.env.RABBITMQ_HOST || 'localhost',
  port: process.env.RABBITMQ_PORT || 5672,
  user: process.env.RABBITMQ_USER || 'user',
  password: process.env.RABBITMQ_PW || 'password',
}));
