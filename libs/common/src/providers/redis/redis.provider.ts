import { cacheConfig } from '@app/common/configs';
import { RedisModuleOptions, RedisOptionsFactory } from '@songkeys/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class RedisProvider implements RedisOptionsFactory {
  constructor(
    @Inject(cacheConfig.KEY)
    private config: ConfigType<typeof cacheConfig>,
  ) {}

  createRedisOptions(): RedisModuleOptions {
    return {
      closeClient: true,
      readyLog: true,
      errorLog: true,
      config: {
        host: this.config.host,
        port: this.config.port,
        password: this.config.password,
      },
    };
  }
}
