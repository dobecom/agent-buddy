import { Test, TestingModule } from '@nestjs/testing';
import { IntakeAgentController } from './intake-agent.controller';
import { IntakeAgentService } from './intake-agent.service';

describe('IntakeAgentController', () => {
  let intakeAgentController: IntakeAgentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IntakeAgentController],
      providers: [IntakeAgentService],
    }).compile();

    intakeAgentController = app.get<IntakeAgentController>(IntakeAgentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(intakeAgentController.getHello()).toBe('Hello World!');
    });
  });
});
