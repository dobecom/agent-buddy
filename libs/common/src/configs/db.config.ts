import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  hostMaster: process.env.DB_MASTER_HOST || '127.0.0.1',
  portMaster: parseInt(process.env.DB_MASTER_PORT as string, 10) || 3306,
  databaseMaster: process.env.DB_MASTER_NAME,
  usernameMaster: process.env.DB_MASTER_USERNAME,
  passwordMaster: process.env.DB_MASTER_PASSWORD,
  loggingMaster: process.env.DB_MASTER_LOGGING === 'true' ? true : false,
  hostSlave1: process.env.DB_SLAVE1_HOST || '127.0.0.1',
  portSlave1: parseInt(process.env.DB_SLAVE1_PORT as string, 10) || 3307,
  databaseSlave1: process.env.DB_SLAVE1_NAME,
  usernameSlave1: process.env.DB_SLAVE1_USERNAME,
  passwordSlave1: process.env.DB_SLAVE1_PASSWORD,
  loggingSlave1: process.env.DB_SLAVE1_LOGGING === 'true' ? true : false,
}));
