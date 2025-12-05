import { Controller, Get } from '@nestjs/common';
import { ScopingAgentService } from './scoping-agent.service';

@Controller()
export class ScopingAgentController {
  constructor(private readonly scopingAgentService: ScopingAgentService) {}

  @Get()
  getHello(): string {
    return this.scopingAgentService.getHello();
  }
}
