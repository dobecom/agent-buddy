import { Controller, Get } from '@nestjs/common';
import { ProcessingAgentService } from './processing-agent.service';

@Controller()
export class ProcessingAgentController {
  constructor(private readonly processingAgentService: ProcessingAgentService) {}

  @Get()
  getHello(): string {
    return this.processingAgentService.getHello();
  }
}
