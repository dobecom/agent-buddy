import { Module } from '@nestjs/common';
import { CaseAttachesController } from './attaches/case.attaches.controller';
import { CaseStatementsService } from './statements/case.statements.service';
import { CaseResolutionsService } from './resolutions/case.resolutions.service';
import { CaseAttachesService } from './attaches/case.attaches.service';
import { CaseAttachesRService } from './attachesR/case.attaches.r.service';
import { CaseStatementsRepository } from './statements/case.statements.repository';
import { CaseResolutionsRepository } from './resolutions/case.resolutions.repository';
import { CaseAttachesRepository } from './attaches/case.attaches.repository';
import { CaseAttachesRRepository } from './attachesR/case.attaches.r.repository';
import { CommonModule } from '@app/common';
import { MicroservicesModule } from '@app/common/microservices.module';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { CasesRepository } from './cases.repository';

const controllers = [
  CasesController,
  CaseAttachesController
];

const services = [
  CasesService,
  CaseStatementsService,
  CaseResolutionsService,
  CaseAttachesService,
  CaseAttachesRService
];

const repositories = [
  CasesRepository,
  CaseStatementsRepository,
  CaseResolutionsRepository,
  CaseAttachesRepository,
  CaseAttachesRRepository
];


@Module({
  imports: [CommonModule, MicroservicesModule],
  controllers: [...controllers],
  providers: [
    ...services,
    ...repositories
  ],
})
export class CasesModule { }
