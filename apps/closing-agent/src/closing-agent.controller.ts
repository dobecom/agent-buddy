import { Controller, Get } from '@nestjs/common';
import { ClosingAgentService } from './closing-agent.service';

@Controller()
export class ClosingAgentController {
  constructor(private readonly closingAgentService: ClosingAgentService) {}

  @Get()
  getHello(): string {
    return this.closingAgentService.getHello();
  }
}
