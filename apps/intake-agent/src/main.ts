import { NestFactory } from '@nestjs/core';
import { IntakeAgentModule } from './intake-agent.module';

async function bootstrap() {
  const app = await NestFactory.create(IntakeAgentModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
