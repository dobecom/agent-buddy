import { Module } from '@nestjs/common';
import { ProcessingAgentController } from './processing-agent.controller';
import { ProcessingAgentService } from './processing-agent.service';

@Module({
  imports: [],
  controllers: [ProcessingAgentController],
  providers: [ProcessingAgentService],
})
export class ProcessingAgentModule {}
