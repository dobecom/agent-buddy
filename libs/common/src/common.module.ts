import { RedisModule } from '@songkeys/nestjs-redis';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AxiosModule } from './axios/axios.module';
import { appConfig, authConfig, cacheConfig, dbConfig, emailConfig, extconnConfig, mqConfig } from './configs';
import { RedisProvider } from './providers/redis/redis.provider';
import { DataMapper } from './utils/data.mapper';
import { Logger } from './utils/logger';
import { PgsqlMasterProvider } from './providers/db/pgsql.master.provider';
import { PgsqlSlave1Provider } from './providers/db/pgsql.slave1.provider';
import { ResignAuthGuard } from './guards/resign.auth.guard';
import { SignAdminGuard } from './guards/sign.admin.guard';
import { SignAuthGuard } from './guards/sign.auth.guard';
import { ResignStrategy } from './guards/resign.auth.strategy';
import { SignAdminStrategy } from './guards/sign.admin.strategy';
import { SignStrategy } from './guards/sign.auth.strategy';
import { DateModifier } from './utils/date.modifier';
import { DataMasker } from './utils/data.masker';

const signGuards = [
  ResignAuthGuard,
  SignAdminGuard,
  SignAuthGuard,
];
const signStrategies = [
  ResignStrategy,
  SignAdminStrategy,
  SignStrategy,
];
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig, dbConfig, cacheConfig, authConfig, extconnConfig, emailConfig, mqConfig],
    }),
    TypeOrmModule.forRootAsync({
      name: 'DB_MASTER',
      useClass: PgsqlMasterProvider,
    }),
    TypeOrmModule.forRootAsync({
      name: 'DB_SLAVE1',
      useClass: PgsqlSlave1Provider,
    }),
    PassportModule.register({}),
    JwtModule.register({}),
    AxiosModule,
    /* Redis Standalone */
    RedisModule.forRootAsync({
      useClass: RedisProvider,
    }),
    /* Redis Cluster */
    /*
    ClusterModule.forRootAsync({
      useClass: RedisClusterProvider,
    }),
    */
  ],
  exports: [Logger, DataMapper, DateModifier, AxiosModule, DataMasker, ...signGuards, ...signStrategies],
  providers: [Logger, DataMapper, DateModifier, AxiosModule, DataMasker, ...signGuards, ...signStrategies],
})
export class CommonModule {}
