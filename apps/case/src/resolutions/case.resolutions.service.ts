import { CaseResolutions } from '@app/common/domains/CaseResolutions';
import { Logger } from '@app/common/utils/logger';
import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CaseResolutionsRepository } from './case.resolutions.repository';
import { ErrorCodes } from '@app/common/code/error/error.code';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { appConfig } from '@app/common/configs';
import type { ConfigType } from '@nestjs/config';
import { CaseAttachesService } from '../attaches/case.attaches.service';

@Injectable()
export class CaseResolutionsService {
  constructor(
    @InjectDataSource('DB_MASTER')
    private dbMaster: DataSource,
    private logger: Logger,
    private attachesService: CaseAttachesService,
    private repository: CaseResolutionsRepository,
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
  ) { }

  async register(pCaseResolutions: CaseResolutions): Promise<any> {
    const queryRunner = this.dbMaster.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const publishId = await this.repository.create(pCaseResolutions, queryRunner);
      if (!publishId) {
        throw new InternalServerErrorException({
          code: ErrorCodes.IS006,
        });
      }
      // -- Commit
      await queryRunner.commitTransaction();

      return {
        casesPublishes: {
          id: publishId,
        },
      };
    } catch (err) {
      // -- RollBack
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // - End QueryRunner - Transaction
      await queryRunner.release();
    }
  }

  async list(pCaseResolutions: CaseResolutions): Promise<any> {
    const casesPublishesList = await this.repository.findAll(pCaseResolutions);
    const casesPublishesCnt = await this.repository.findCnt(pCaseResolutions);
    return { casesPublishesList, casesPublishesCnt };
  }

  async view(pCaseResolutions: CaseResolutions): Promise<any> {
    const casesPublishes = await this.repository.find(pCaseResolutions);
    // 공시 첨부파일 리스트 조회
    const idList = casesPublishes.array.filter((item) => item !== null);
    const casesAttachesList = await this.attachesService.listByIds(idList);

    delete casesPublishes.array;
    return casesPublishes ? { casesPublishes, casesAttachesList } : { casesPublishes: null };
  }

  async renew(pCaseResolutions: CaseResolutions): Promise<any> {
    const queryRunner = this.dbMaster.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 기존 공시 첨부파일 리스트 조회
      const casesPublishes = await this.repository.find(pCaseResolutions, queryRunner);
      const idList = casesPublishes.array.filter((item) => item !== null);

      // const result = await this.repository.alter(pCaseResolutions);
      // if (!result) {
      //   throw new InternalServerErrorException({
      //     code: ErrorCodes.IS001,
      //   });
      // }
      // -- Commit
      await queryRunner.commitTransaction();

      return {};
    } catch (err) {
      // -- RollBack
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // - End QueryRunner - Transaction
      await queryRunner.release();
    }
  }

  async erase(pCaseResolutions: CaseResolutions): Promise<any> {
    const result = await this.repository.remove(pCaseResolutions);
    if (!result) {
      throw new InternalServerErrorException({
        code: ErrorCodes.IS001,
      });
    }
    return {};
  }




}
