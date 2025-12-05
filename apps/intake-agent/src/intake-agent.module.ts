import { Module } from '@nestjs/common';
import { IntakeAgentController } from './intake-agent.controller';
import { IntakeAgentService } from './intake-agent.service';

@Module({
  imports: [],
  controllers: [IntakeAgentController],
  providers: [IntakeAgentService],
})
export class IntakeAgentModule {}
