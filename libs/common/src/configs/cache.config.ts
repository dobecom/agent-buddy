import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  host: process.env.CACHE_HOST || '127.0.0.1',
  port: parseInt(process.env.CACHE_PORT || '', 10) || 6379,
  password: process.env.CACHE_PASSWORD || '',
  // For Cluster
  // node1_master_host: process.env.CACHE_HOST || '127.0.0.1',
  // node1_master_port: parseInt(process.env.CACHE_PORT || '', 10) || 6379,
  // node2_master_host: process.env.CACHE_HOST || '127.0.0.1',
  // node2_master_port: parseInt(process.env.CACHE_PORT || '', 10) || 6380,
  // node3_master_host: process.env.CACHE_HOST || '127.0.0.1',
  // node3_master_port: parseInt(process.env.CACHE_PORT || '', 10) || 6381,
  // node1_slave_host: process.env.CACHE_HOST || '127.0.0.1',
  // node1_slave_port: parseInt(process.env.CACHE_PORT || '', 10) || 6479,
  // node2_slave_host: process.env.CACHE_HOST || '127.0.0.1',
  // node2_slave_port: parseInt(process.env.CACHE_PORT || '', 10) || 6480,
  // node3_slave_host: process.env.CACHE_HOST || '127.0.0.1',
  // node3_slave_port: parseInt(process.env.CACHE_PORT || '', 10) || 6481,
}));
