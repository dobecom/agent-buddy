import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzingAgentController } from './analyzing-agent.controller';
import { AnalyzingAgentService } from './analyzing-agent.service';

describe('AnalyzingAgentController', () => {
  let analyzingAgentController: AnalyzingAgentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AnalyzingAgentController],
      providers: [AnalyzingAgentService],
    }).compile();

    analyzingAgentController = app.get<AnalyzingAgentController>(AnalyzingAgentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(analyzingAgentController.getHello()).toBe('Hello World!');
    });
  });
});
