import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Cases } from '@app/common/domains/Cases';
import { CaseMessage } from '@app/common/providers/messages/case.message';
import { CasesService } from './cases.service';

@Controller()
export class CasesController {
  constructor(private readonly casesService: CasesService) { }

  @MessagePattern(CaseMessage.CASE_REGISTER)
  async registerBiz(@Payload('cases') pCases: Cases): Promise<any> {
    return await this.casesService.register(pCases);
  }

  @MessagePattern(CaseMessage.CASE_LIST)
  async listAdm(@Payload('cases') pCases: Cases): Promise<any> {
    return await this.casesService.list(pCases);
  }

  @MessagePattern(CaseMessage.CASE_VIEW)
  async viewAdm(@Payload('cases') pCases: Cases): Promise<any> {
    return await this.casesService.view(pCases);
  }

  @MessagePattern(CaseMessage.CASE_RENEW)
  async renewAdm(@Payload('cases') pCases: Cases): Promise<any> {
    return await this.casesService.renew(pCases);
  }
}
