import { NestFactory } from '@nestjs/core';
import { CaseModule } from './case.module';

async function bootstrap() {
  const app = await NestFactory.create(CaseModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
