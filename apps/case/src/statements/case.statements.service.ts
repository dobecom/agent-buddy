import { CaseStatements } from '@app/common/domains/CaseStatements';
import { Logger } from '@app/common/utils/logger';
import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CaseStatementsRepository } from './case.statements.repository';
import { ErrorCodes } from '@app/common/code/error/error.code';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { appConfig } from '@app/common/configs';
import type { ConfigType } from '@nestjs/config';
import { CaseAttachesService } from '../attaches/case.attaches.service';

@Injectable()
export class CaseStatementsService {
  constructor(
    @InjectDataSource('DB_MASTER')
    private dbMaster: DataSource,
    private logger: Logger,
    private attachesService: CaseAttachesService,
    private repository: CaseStatementsRepository,
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
  ) { }

  async register(pCaseStatements: CaseStatements): Promise<any> {
    const queryRunner = this.dbMaster.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const publishId = await this.repository.create(pCaseStatements, queryRunner);
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

  async list(pCaseStatements: CaseStatements): Promise<any> {
    const casesPublishesList = await this.repository.findAll(pCaseStatements);
    const casesPublishesCnt = await this.repository.findCnt(pCaseStatements);
    return { casesPublishesList, casesPublishesCnt };
  }

  async view(pCaseStatements: CaseStatements): Promise<any> {
    const casesPublishes = await this.repository.find(pCaseStatements);
    // 공시 첨부파일 리스트 조회
    const idList = casesPublishes.array.filter((item) => item !== null);
    const casesAttachesList = await this.attachesService.listByIds(idList);

    delete casesPublishes.array;
    return casesPublishes ? { casesPublishes, casesAttachesList } : { casesPublishes: null };
  }

  async renew(pCaseStatements: CaseStatements): Promise<any> {
    const queryRunner = this.dbMaster.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 기존 공시 첨부파일 리스트 조회
      const casesPublishes = await this.repository.find(pCaseStatements, queryRunner);
      const idList = casesPublishes.array.filter((item) => item !== null);

      // const result = await this.repository.alter(pCaseStatements);
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

  async erase(pCaseStatements: CaseStatements): Promise<any> {
    const result = await this.repository.remove(pCaseStatements);
    if (!result) {
      throw new InternalServerErrorException({
        code: ErrorCodes.IS001,
      });
    }
    return {};
  }




}
