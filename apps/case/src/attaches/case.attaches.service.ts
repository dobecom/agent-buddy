import { ErrorCodes } from '@app/common/code/error/error.code';
import { CaseAttaches } from '@app/common/domains/CaseAttaches';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CaseAttachesRepository } from './case.attaches.repository';

@Injectable()
export class CaseAttachesService {
  constructor(private repository: CaseAttachesRepository) { }

  /** CRUD : register > list > view > count > renew > erase */
  async registerAdm(pCaseAttaches: CaseAttaches): Promise<any> {
    const attachId = await this.repository.createBiz(pCaseAttaches);
    if (!attachId) {
      throw new InternalServerErrorException({
        code: ErrorCodes.IS006,
      });
    }
    const caseAttaches = {
      id: attachId,
    } as CaseAttaches;
    return { caseAttaches };
  }

  async registerBiz(pCaseAttaches: CaseAttaches): Promise<any> {
    const attachId = await this.repository.createBiz(pCaseAttaches);
    if (!attachId) {
      throw new InternalServerErrorException({
        code: ErrorCodes.IS006,
      });
    }
    const caseAttaches = {
      id: attachId,
    } as CaseAttaches;
    return { caseAttaches };
  }

  // list by relation
  async listBiz(pCaseAttaches: CaseAttaches): Promise<any> {
    const caseAttachesList = await this.repository.findAllBiz(pCaseAttaches);
    const caseAttachesCnt = await this.repository.findCntBiz(pCaseAttaches);
    return { caseAttachesList, caseAttachesCnt };
  }

  async list(pCaseAttaches: CaseAttaches): Promise<any> {
    const caseAttachesList = await this.repository.findAll(pCaseAttaches);
    const caseAttachesCnt = await this.repository.findCnt(pCaseAttaches);
    return { caseAttachesList, caseAttachesCnt };
  }

  async renewByIds(ids: string[], queryRunner?: QueryRunner): Promise<any> {
    return this.repository.alterForRegisterByIds(ids, queryRunner);
  }

  async renewForRegisterByIds(ids: string[], queryRunner?: QueryRunner): Promise<any> {
    return this.repository.alterForRegisterByIds(ids, queryRunner);
  }

  async renewForRenewByIds(oldIds: string[], newIds: string[], queryRunner?: QueryRunner): Promise<any> {
    if (oldIds && oldIds.length > 0) {
      const deleteList = [] as string[];
      for (const item of oldIds) {
        if (!newIds.includes(item)) {
          deleteList.push(item);
        }
      }
      if (deleteList.length > 0) {
        const removeResult = await this.repository.removeByIds(oldIds, queryRunner);
        if (!removeResult) {
          throw new InternalServerErrorException({
            code: ErrorCodes.IS001,
          });
        }
      }
    }
    return this.repository.alterForRegisterByIds(newIds, queryRunner);
  }

  // list by no relation
  async listByIds(ids: string[], queryRunner?: QueryRunner): Promise<any> {
    return this.repository.findAllByIds(ids, queryRunner);
  }

  async eraseByIds(ids: string[], queryRunner?: QueryRunner): Promise<any> {
    return this.repository.removeByIds(ids, queryRunner);
  }
}
