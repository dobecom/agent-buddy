import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessingAgentService {
  getHello(): string {
    return 'Hello World!';
  }
}
