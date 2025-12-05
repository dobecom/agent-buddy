import { Module } from '@nestjs/common';
import { ScopingAgentController } from './scoping-agent.controller';
import { ScopingAgentService } from './scoping-agent.service';

@Module({
  imports: [],
  controllers: [ScopingAgentController],
  providers: [ScopingAgentService],
})
export class ScopingAgentModule {}
