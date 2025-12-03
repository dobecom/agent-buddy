import { dbConfig } from '@app/common/configs';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PgsqlMasterProvider implements TypeOrmOptionsFactory {
  constructor(
    @Inject(dbConfig.KEY)
    private config: ConfigType<typeof dbConfig>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'DB_MASTER',
      type: 'postgres',
      host: this.config.hostMaster,
      port: this.config.portMaster,
      username: this.config.usernameMaster,
      password: this.config.passwordMaster,
      database: this.config.databaseMaster,
      logging: this.config.loggingMaster,
      synchronize: false,
      autoLoadEntities: false,
      // keepConnectionAlive: true,
    };
  }
}
