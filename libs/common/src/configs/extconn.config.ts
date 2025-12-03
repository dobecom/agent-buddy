import { registerAs } from '@nestjs/config';

export default registerAs('extconn', () => ({
  proxy: {
    pass: parseInt(process.env.EXTCONN_PROXY_PASS as string, 10) || 0,
    protocol: process.env.EXTCONN_PROXY_PROTOCOL || '---',
    host: process.env.EXTCONN_PROXY_HOST || '---',
    port: parseInt(process.env.EXTCONN_PROXY_PORT as string, 10) || 0,
  },

}));
