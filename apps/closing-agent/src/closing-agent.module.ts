import { Module } from '@nestjs/common';
import { ClosingAgentController } from './closing-agent.controller';
import { ClosingAgentService } from './closing-agent.service';

@Module({
  imports: [],
  controllers: [ClosingAgentController],
  providers: [ClosingAgentService],
})
export class ClosingAgentModule {}
