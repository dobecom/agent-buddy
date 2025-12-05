import { NestFactory } from '@nestjs/core';
import { ClosingAgentModule } from './closing-agent.module';

async function bootstrap() {
  const app = await NestFactory.create(ClosingAgentModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
