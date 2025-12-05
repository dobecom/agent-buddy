import { Injectable } from '@nestjs/common';

@Injectable()
export class IntakeAgentService {
  getHello(): string {
    return 'Hello World!';
  }
}
