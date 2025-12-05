import { mqConfig } from '@app/common/configs';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CasesModule } from './cases.module';

async function bootstrap() {
  const app = await NestFactory.create(CasesModule);
  const config = app.get<ConfigType<typeof mqConfig>>(mqConfig.KEY);
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${config.user}:${config.password}@${config.host}:${config.port}`],
        queue: 'case',
        noAck: true,
        queueOptions: {
          durable: true,
        },
      },
    },
    {
      inheritAppConfig: true,
    },
  );
  app.startAllMicroservices();
}
bootstrap();
