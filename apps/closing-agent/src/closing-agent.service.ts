import { Injectable } from '@nestjs/common';

@Injectable()
export class ClosingAgentService {
  getHello(): string {
    return 'Hello World!';
  }
}
