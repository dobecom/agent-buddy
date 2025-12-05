import { Injectable } from '@nestjs/common';

@Injectable()
export class ScopingAgentService {
  getHello(): string {
    return 'Hello World!';
  }
}
