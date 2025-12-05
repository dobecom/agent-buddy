import { ErrorCodes } from '@app/common/code/error/error.code';
import { Cases } from '@app/common/domains/Cases';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { CaseAttachesRService } from './attachesR/case.attaches.r.service';
import { CaseAttachesR } from '@app/common/domains/CaseAttachesR';
import { CaseAttachesService } from './attaches/case.attaches.service';
import { CasesRepository } from './cases.repository';

@Injectable()
export class CasesService {
  constructor(
    @InjectDataSource('DB_MASTER')
    private dbMaster: DataSource,
    private readonly repository: CasesRepository,
    private readonly attachesService: CaseAttachesService,
    private readonly attachesRService: CaseAttachesRService,
  ) { }

  async register(pCases: Cases): Promise<any> {
    // - Start QueryRunner - Transaction
    const queryRunner = this.dbMaster.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let caseId;
      if (pCases.id) {
        throw new ConflictException({
          code: ErrorCodes.CF001,
        });
      } else {
        caseId = await this.repository.create(pCases, queryRunner);
        if (!caseId) {
          throw new InternalServerErrorException({
            code: ErrorCodes.IS001,
          });
        }
        pCases.id = caseId;
        await this.fileUploadProcess(pCases, queryRunner);
        // await this.
      }

      // -- Commit
      await queryRunner.commitTransaction();
      return {
        cases: {
          id: pCases.id ? pCases.id : caseId,
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

  async list(pCases: Cases): Promise<any> {
    const casesList = await this.repository.findAll(pCases);
    const casesCnt = await this.repository.findCnt(pCases);
    return { casesList, casesCnt };
  }

  async view(pCases: Cases): Promise<any> {
    // const cases = await this.repository.find(pCases);
    // return cases ? { cases } : { cases: null };
  }

  async renew(pCases: Cases): Promise<any> {
    // // - Start QueryRunner - Transaction
    // const queryRunner = this.dbMaster.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // try {
    //   // 요청 값 Validation (거절 or 보류 or 1차 승인 요청일 경우, superBiz 권한 체크)
    //   if (
    //     !(
    //       pCases.status === Cases.STATUS.REJECT ||
    //       pCases.status === Cases.STATUS.HOLD ||
    //       pCases.status === Cases.STATUS.APPROVE_BIZ
    //     )
    //   ) {
    //     throw new BadRequestException({
    //       code: ErrorCodes.BR004,
    //     });
    //   }

    //   // 상태 Validation (1차 승인 가능한 상품 상태 체크. 승인 요청 상태)
    //   const status = await this.repository.findStatus(pCases, queryRunner);
    //   if (!(status === Cases.STATUS.REQUEST)) {
    //     throw new BadRequestException({
    //       code: ErrorCodes.BR003,
    //     });
    //   }

    //   // Update Cases
    //   const result = await this.repository.alterCases(pCases, queryRunner);
    //   if (!result) {
    //     throw new InternalServerErrorException({
    //       code: ErrorCodes.IS001,
    //     });
    //   }
    //   // -- Commit
    //   await queryRunner.commitTransaction();
    // } catch (err) {
    //   // -- RollBack
    //   await queryRunner.rollbackTransaction();
    //   throw err;
    // } finally {
    //   // - End QueryRunner - Transaction
    //   await queryRunner.release();
    // }

    // return {};
  }

  private async fileUploadProcess(pCases: Cases, queryRunner: QueryRunner) {
    const inputAttachesList = [
      ...(pCases.attachIdList ?? []),
    ];

    const pCaseAttachesR = { caseId: pCases.id } as CaseAttachesR;

    // 기존 등록된 파일 조회
    const result = await this.getFiles(pCaseAttachesR, queryRunner);
    if (result.attachesList !== null) {
      // compare attaches
      const attachesCompareResult = this.compareArrays(inputAttachesList, result.attachesList);
      if (!attachesCompareResult.areEqual) {
        // attaches 변경인 경우 등록 및 삭제 처리
        if (attachesCompareResult.addList.length > 0) {
          await this.insertAttachesProcess(inputAttachesList, attachesCompareResult.addList, pCases, queryRunner);
        }
        if (attachesCompareResult.delList.length > 0) {
          // update attaches (status : REGISTER -> DELETE)
          await this.attachesService.eraseByIds(attachesCompareResult.delList, queryRunner);
          // delete attachesR
          await this.attachesRService.eraseByIds(attachesCompareResult.delList, queryRunner);
        }
      }
    } else {
      if (inputAttachesList.length > 0)
        await this.insertAttachesProcess(inputAttachesList, inputAttachesList, pCases, queryRunner);
    }
    return true;
  }

  private async getFiles(
    pCaseAttachesR: CaseAttachesR,
    queryRunner: QueryRunner,
  ) {
    const attachesResult = await this.attachesRService.listByCases(pCaseAttachesR, queryRunner);

    return {
      attachesList: attachesResult && attachesResult.map((item) => item.attachId),
    };
  }

  private compareArrays(a, b) {
    const sortedArr1 = a.slice().sort();
    const sortedArr2 = b.slice().sort();

    const addList = sortedArr1.filter((element) => !sortedArr2.includes(element));
    const delList = sortedArr2.filter((element) => !sortedArr1.includes(element));

    const areEqual =
      sortedArr1.length === sortedArr2.length && sortedArr1.every((element, index) => element === sortedArr2[index]);

    return { areEqual, addList, delList };
  }

  private async insertAttachesProcess(
    inputAttachesList: string[],
    addList: string[],
    pCases: Cases,
    queryRunner: QueryRunner,
  ) {
    // 비정상적인 요청 - 요청 attach가 이미 relation에 등록된 경우
    // const checkDuplicate = await this.attachesRService.listByIds(addList, queryRunner);
    // if (checkDuplicate && checkDuplicate.length > 0) {
    //   throw new BadRequestException({
    //     code: ErrorCodes.BR012,
    //   });
    // }
    // update attaches (status : INSERT -> REGISTER)
    await this.attachesService.renewByIds(addList, queryRunner);
    // insert attachesR with type
    await this.registerAttachesR(addList, pCases, queryRunner);
  }

  private async registerAttachesR(ids: string[], pCases: Cases, queryRunner: QueryRunner) {
    for (const element of ids) {
      let type = CaseAttachesR.TYPE.BROWSER;

      await this.attachesRService.registerBiz(
        {
          attachId: element,
          caseId: pCases.id,
          type,
        } as CaseAttachesR,
        queryRunner,
      );
    }
  }
}
