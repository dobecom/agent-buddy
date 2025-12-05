import { ErrorCodes } from '@app/common/code/error/error.code';
import { appConfig } from '@app/common/configs';
import { Auth } from '@app/common/decorator/auth.decorator';
import { Cases } from '@app/common/domains/Cases';
import { Users } from '@app/common/domains/Users';
import { SignAuthGuard } from '@app/common/guards/sign.auth.guard';

import { ListSchema } from '@app/common/packets/case/List';
import { RegisterCasesSchema } from '@app/common/packets/case/RegisterCases';
import { RenewSchema } from '@app/common/packets/case/Renew';
import { ViewSchema } from '@app/common/packets/case/View';
import { AuthPipe } from '@app/common/pipes/auth.pipe';
import { CaseMessage } from '@app/common/providers/messages/case.message';
import { validateSchema } from '@app/common/utils/joi.validator';
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ClsService } from 'nestjs-cls';
import { lastValueFrom, timeout } from 'rxjs';

@Controller('cases')
export class CaseGateway {
  constructor(
    @Inject('CASE_SERVICE') private caseCp: ClientProxy,
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
    private cls: ClsService,
  ) { }

  /* Admin - Cases ************************************************/
  @Post('/register')
  // @UseGuards(SignAuthGuard)
  async register(
    // @Auth(AuthPipe) pUsers: Users, 
    @Body('cases') pCases: Cases,
    // @Body('caseStatements') pCaseStatements: CaseStatements
  ) {
    const casesRes = RegisterCasesSchema.validate(pCases);
    if (!pCases || casesRes.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    // pCases.createdBy = pUsers.firstName
    //   ? pUsers.lastName
    //     ? `${pUsers.firstName} ${pUsers.lastName}`
    //     : pUsers.firstName
    //   : 'no name';
    return await lastValueFrom(
      this.caseCp
        .send(CaseMessage.CASE_REGISTER, { requestId: this.cls.get('requestId'), cases: pCases })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  @Post('/list')
  @UseGuards(SignAuthGuard)
  async listCase(@Auth(AuthPipe) pUsers: Users, @Body('cases') pCases: Cases) {
    const res = ListSchema.validate(pCases);
    if (!pCases || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    return await lastValueFrom(
      this.caseCp
        .send(CaseMessage.CASE_LIST, { requestId: this.cls.get('requestId'), cases: pCases, members: pUsers })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  @Post('/view')
  @UseGuards(SignAuthGuard)
  async viewAdm(@Auth(AuthPipe) pUsers: Users, @Body('cases') pCases: Cases) {
    const res = ViewSchema.validate(pCases);
    if (!pCases || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    return await lastValueFrom(
      this.caseCp
        .send(CaseMessage.CASE_VIEW, { requestId: this.cls.get('requestId'), cases: pCases })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  @Post('/renew')
  @UseGuards(SignAuthGuard)
  async renew(@Auth(AuthPipe) pUsers: Users, @Body('cases') pCases: Cases) {
    const res = RenewSchema.validate(pCases);
    if (!pCases || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    pCases.updatedBy = pUsers.firstName
      ? pUsers.lastName
        ? `${pUsers.firstName} ${pUsers.lastName}`
        : pUsers.firstName
      : 'no name';
    return await lastValueFrom(
      this.caseCp
        .send(CaseMessage.CASE_RENEW, { requestId: this.cls.get('requestId'), cases: pCases })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  // @Post('/erase')
  // @UseGuards(SignAuthGuard)
  // async erase(@Auth(AuthPipe) pUsers: Users, @Body('cases') pCases: Cases) {
  //   const res = ViewSchema.validate(pCases);
  //   if (!pCases || res.error) {
  //     throw new BadRequestException({
  //       code: ErrorCodes.BR001,
  //     });
  //   }
  //   pCases.updatedBy = pUsers.firstName
  //     ? pUsers.lastName
  //       ? `${pUsers.firstName} ${pUsers.lastName}`
  //       : pUsers.firstName
  //     : 'no name';
  //   return await lastValueFrom(
  //     this.caseCp
  //       .send(CaseMessage.CASE_ERASE, { requestId: this.cls.get('requestId'), cases: pCases })
  //       .pipe(timeout(this.appConf.AppsTimeout)),
  //   );
  // }

  /* Case - Cases **************************************************/
  // - Nothing

  /* User - Cases *************************************************/
  // - Nothing

  /* Public - Cases ***********************************************/

}
