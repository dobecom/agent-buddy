import { Module } from '@nestjs/common';
import { AnalyzingAgentController } from './analyzing-agent.controller';
import { AnalyzingAgentService } from './analyzing-agent.service';

@Module({
  imports: [],
  controllers: [AnalyzingAgentController],
  providers: [AnalyzingAgentService],
})
export class AnalyzingAgentModule {}
