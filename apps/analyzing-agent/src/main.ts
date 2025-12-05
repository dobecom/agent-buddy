import { NestFactory } from '@nestjs/core';
import { AnalyzingAgentModule } from './analyzing-agent.module';

async function bootstrap() {
  const app = await NestFactory.create(AnalyzingAgentModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
