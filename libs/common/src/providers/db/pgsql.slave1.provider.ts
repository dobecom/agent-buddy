import { dbConfig } from '@app/common/configs';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PgsqlSlave1Provider implements TypeOrmOptionsFactory {
  constructor(
    @Inject(dbConfig.KEY)
    private config: ConfigType<typeof dbConfig>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'DB_SLAVE1',
      type: 'postgres',
      host: this.config.hostSlave1,
      port: this.config.portSlave1,
      username: this.config.usernameSlave1,
      password: this.config.passwordSlave1,
      database: this.config.databaseSlave1,
      logging: this.config.loggingSlave1,
      synchronize: false,
      autoLoadEntities: false,
      // keepConnectionAlive: true,
    };
  }
}
