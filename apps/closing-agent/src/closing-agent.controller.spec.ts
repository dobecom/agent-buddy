import { Test, TestingModule } from '@nestjs/testing';
import { ClosingAgentController } from './closing-agent.controller';
import { ClosingAgentService } from './closing-agent.service';

describe('ClosingAgentController', () => {
  let closingAgentController: ClosingAgentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ClosingAgentController],
      providers: [ClosingAgentService],
    }).compile();

    closingAgentController = app.get<ClosingAgentController>(ClosingAgentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(closingAgentController.getHello()).toBe('Hello World!');
    });
  });
});
