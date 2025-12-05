import { Test, TestingModule } from '@nestjs/testing';
import { ProcessingAgentController } from './processing-agent.controller';
import { ProcessingAgentService } from './processing-agent.service';

describe('ProcessingAgentController', () => {
  let processingAgentController: ProcessingAgentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProcessingAgentController],
      providers: [ProcessingAgentService],
    }).compile();

    processingAgentController = app.get<ProcessingAgentController>(ProcessingAgentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(processingAgentController.getHello()).toBe('Hello World!');
    });
  });
});
