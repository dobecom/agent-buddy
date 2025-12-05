import { ErrorCodes } from '@app/common/code/error/error.code';
import { CaseAttachesR } from '@app/common/domains/CaseAttachesR';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CaseAttachesRRepository } from './case.attaches.r.repository';

@Injectable()
export class CaseAttachesRService {
  constructor(private repository: CaseAttachesRRepository) { }

  /** CRUD : register > list > view > count > renew > erase */
  async registerBiz(pCaseAttachesR: CaseAttachesR, queryRunner: QueryRunner): Promise<any> {
    const result = await this.repository.createBiz(pCaseAttachesR, queryRunner);
    if (!result) {
      throw new InternalServerErrorException({
        code: ErrorCodes.IS006,
      });
    }
    return {};
  }

  async listByIds(ids: number[], queryRunner?: QueryRunner): Promise<any> {
    return this.repository.findAllByIds(ids, queryRunner);
  }

  async listByCases(pCaseAttachesR: CaseAttachesR, queryRunner?: QueryRunner): Promise<any> {
    return this.repository.findAllByCases(pCaseAttachesR, queryRunner);
  }

  eraseByIds(ids: number[], queryRunner: QueryRunner): Promise<any> {
    return this.repository.removeByImageIds(ids, queryRunner);
  }
}
