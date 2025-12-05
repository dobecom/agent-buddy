import { NestFactory } from '@nestjs/core';
import { ScopingAgentModule } from './scoping-agent.module';

async function bootstrap() {
  const app = await NestFactory.create(ScopingAgentModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
