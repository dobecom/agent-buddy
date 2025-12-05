import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyzingAgentService {
  getHello(): string {
    return 'Hello World!';
  }
}
