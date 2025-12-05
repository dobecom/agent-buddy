import { Controller, Get } from '@nestjs/common';
import { AnalyzingAgentService } from './analyzing-agent.service';

@Controller()
export class AnalyzingAgentController {
  constructor(private readonly analyzingAgentService: AnalyzingAgentService) {}

  @Get()
  getHello(): string {
    return this.analyzingAgentService.getHello();
  }
}
