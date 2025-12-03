import { appConfig } from '@app/common/configs';
import { Logger } from '@app/common/utils/logger';

import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './module';

async function bootstrap() {
  // Init App
  const app = await NestFactory.create(GatewayModule);
  // Get Config
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  // Set
  // - Logger
  app.useLogger(app.get(Logger));
  // - CORS
  app.enableCors({
    origin: config.corsOrigins,
    credentials: true,
  });
  // Start
  await app.listen(config.port);
}
bootstrap();
