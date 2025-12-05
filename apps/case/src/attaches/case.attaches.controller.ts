import { CaseAttaches } from '@app/common/domains/CaseAttaches';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CaseAttachesService } from './case.attaches.service';
import { CaseMessage } from '@app/common/providers/messages/case.message';

@Controller()
export class CaseAttachesController {
  constructor(private readonly caseAttachesService: CaseAttachesService) { }

  @MessagePattern(CaseMessage.CASE_ATTACH_REGISTER)
  async register(@Payload('caseAttaches') pCaseAttaches: CaseAttaches): Promise<any> {
    return await this.caseAttachesService.registerAdm(pCaseAttaches);
  }

  @MessagePattern(CaseMessage.CASE_ATTACH_LIST)
  async listAttach(@Payload('caseAttaches') pCaseAttaches: CaseAttaches): Promise<any> {
    return await this.caseAttachesService.list(pCaseAttaches);
  }
}
