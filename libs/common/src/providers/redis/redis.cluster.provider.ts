import { ClusterModuleOptions, ClusterOptionsFactory } from '@songkeys/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import cacheConfig from '@/core/configs/cache.config';

@Injectable()
export class RedisClusterProvider implements ClusterOptionsFactory {
  constructor(
    @Inject(cacheConfig.KEY)
    private config: ConfigType<typeof cacheConfig>,
  ) {}

  createClusterOptions(): ClusterModuleOptions {
    return {
      closeClient: true,
      readyLog: true,
      errorLog: true,
      config: {
        nodes: [
          /*
          `redis://${this.config.node1_master_host}:${this.config.node1_master_port}`,
          `redis://${this.config.node2_master_host}:${this.config.node2_master_port}`,
          `redis://${this.config.node3_master_host}:${this.config.node3_master_port}`,
          `redis://${this.config.node1_slave_host}:${this.config.node1_slave_port}`,
          `redis://${this.config.node2_slave_host}:${this.config.node2_slave_port}`,
          `redis://${this.config.node3_slave_host}:${this.config.node3_slave_port}`,
          */
        ],
        redisOptions: {},
      },
    };
  }
}
