import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { pgQuery } from '@app/common/utils/pg.query';
import { CaseAttachesR } from '@app/common/domains/CaseAttachesR';
import { DataMapper } from '@app/common/utils/data.mapper';
import { CaseAttaches } from '@app/common/domains/CaseAttaches';

@Injectable()
export class CaseAttachesRRepository {
  constructor(
    @InjectDataSource('DB_MASTER')
    private dbMaster: DataSource,
    @InjectDataSource('DB_SLAVE1')
    private dbSlave1: DataSource,
    private dataMapper: DataMapper,
  ) { }

  /** CRUD : create > findAll > find > findCnt > alter > remove */
  async createBiz(pCaseAttachesR: CaseAttachesR, queryRunner?: QueryRunner) {
    const sql = `
INSERT INTO cases_attaches_r
  (case_id, attach_id, type)
VALUES
  ($1, $2, $3)
RETURNING attach_id
        `;
    const result = await pgQuery(queryRunner || this.dbMaster, sql, [
      pCaseAttachesR.caseId,
      pCaseAttachesR.attachId,
      pCaseAttachesR.type,
    ]);
    return result[0] && result[0].attach_id ? result[0].attach_id : 0;
  }

  async findAllByIds(ids: number[], queryRunner?: QueryRunner) {
    const data = await this.dbSlave1.query(
      `
SELECT
	attach_id
FROM
	cases_attaches_r 
WHERE 
  attach_id IN (${ids.map((item) => `${item}`).join(', ')});
    `,
      [],
      queryRunner,
    );
    return await this.dataMapper.castList<CaseAttachesR>(data);
  }

  async findAllByCases(pCaseAttachesR: CaseAttachesR, queryRunner?: QueryRunner) {
    const data = await this.dbSlave1.query(
      `
SELECT
	T1.attach_id
FROM
	cases_attaches_r T1
JOIN cases_attaches T2 ON
	T1.attach_id = T2.id
	AND T2.status = $1
WHERE
	T1.case_id = $2;
    `,
      [CaseAttaches.STATUS.VERIFY, pCaseAttachesR.caseId],
      queryRunner,
    );
    return await this.dataMapper.castList<CaseAttachesR>(data);
  }

  async removeByImageIds(ids: number[], queryRunner?: QueryRunner) {
    const sql = `
UPDATE 
  cases_attaches_r 
SET 
  case_id = NULL
WHERE
  attach_id IN (${ids.map((item) => `${item}`).join(', ')})
        `;
    const result = await pgQuery(queryRunner || this.dbMaster, sql, []);
    return result[1] > 0 ? true : false;
  }
}
