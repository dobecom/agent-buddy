import { Test, TestingModule } from '@nestjs/testing';
import { ScopingAgentController } from './scoping-agent.controller';
import { ScopingAgentService } from './scoping-agent.service';

describe('ScopingAgentController', () => {
  let scopingAgentController: ScopingAgentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ScopingAgentController],
      providers: [ScopingAgentService],
    }).compile();

    scopingAgentController = app.get<ScopingAgentController>(ScopingAgentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(scopingAgentController.getHello()).toBe('Hello World!');
    });
  });
});
