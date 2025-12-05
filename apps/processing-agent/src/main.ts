import { NestFactory } from '@nestjs/core';
import { ProcessingAgentModule } from './processing-agent.module';

async function bootstrap() {
  const app = await NestFactory.create(ProcessingAgentModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
