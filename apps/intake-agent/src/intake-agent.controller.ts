import { Controller, Get } from '@nestjs/common';
import { IntakeAgentService } from './intake-agent.service';

@Controller()
export class IntakeAgentController {
  constructor(private readonly intakeAgentService: IntakeAgentService) {}

  @Get()
  getHello(): string {
    return this.intakeAgentService.getHello();
  }
}
