import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataMapper } from '@app/common/utils/data.mapper';
import { pgQuery } from '@app/common/utils/pg.query';
import { CaseResolutions } from '@app/common/domains/CaseResolutions';

@Injectable()
export class CaseResolutionsRepository {
  constructor(
    @InjectDataSource('DB_MASTER')
    private dbMaster: DataSource,
    @InjectDataSource('DB_SLAVE1')
    private dbSlave1: DataSource,
    private dataMapper: DataMapper,
  ) { }

  async create(pCaseResolutions: CaseResolutions, queryRunner?: QueryRunner) {
    const result = await pgQuery(
      queryRunner || this.dbMaster,
      `
INSERT INTO case_resolutions (id,case_id,"content",created_at,created_by,updated_at,updated_by) 
VALUES ($1, $2, $3, NOW(), $4, NOW(), $5)
RETURNING id
        `,
      [
        pCaseResolutions.id,
        pCaseResolutions.caseId,
        pCaseResolutions.content,
        pCaseResolutions.createdBy ?? 'system',
        pCaseResolutions.updatedBy ?? 'system',
      ]

    );
    return result[0] && result[0].id ? result[0].id : 0;
  }

  async find(pCaseResolutions: CaseResolutions, queryRunner?: QueryRunner) {
    const data = await this.dbSlave1.query(
      `
SELECT
  T1.case_id, 
  (SELECT "name" FROM cases WHERE id = T1.case_id) AS case_name,
  ARRAY[T1.attach_id1, T1.attach_id2, T1.attach_id3, T1.attach_id4, T1.attach_id5],
  T1.type, T1.title, T1.content, T1.is_reserved, T1.upload_at, T1.created_by, T1.updated_by, T1.created_at, T1.updated_at
FROM
  case_resolutions T1
WHERE
  T1.id = $1
  AND T1.status = $2
    `,
      [pCaseResolutions.id, CaseResolutions.STATUS.OPEN],
      queryRunner,
    );
    return this.dataMapper.cast<CaseResolutions>(data);
  }

  async alter(pCaseResolutions: CaseResolutions, queryRunner?: QueryRunner) {
    // SQL
    let bindNum = 0;
    const sql = `
 UPDATE 
   case_resolutions
 SET
   case_id = $${++bindNum}, attach_id1 = $${++bindNum}, attach_id2 = $${++bindNum}, attach_id3 = $${++bindNum}, attach_id4 = $${++bindNum}, attach_id5 = $${++bindNum}, 
   "type" = $${++bindNum}, title = $${++bindNum}, "content" = $${++bindNum}, is_reserved = $${++bindNum}, upload_at = $${++bindNum}, updated_by = $${++bindNum}, updated_at = NOW()
 WHERE 
   id = $${++bindNum} 
 RETURNING *
     `;

    // Execute
    // const result = await pgQuery(queryRunner || this.dbMaster, sql, [
    //   pCaseResolutions.caseId,
    //   pCaseResolutions.attachIdList[0],
    //   pCaseResolutions.attachIdList[1],
    //   pCaseResolutions.attachIdList[2],
    //   pCaseResolutions.attachIdList[3],
    //   pCaseResolutions.attachIdList[4],
    //   pCaseResolutions.type,
    //   pCaseResolutions.title,
    //   pCaseResolutions.content,
    //   pCaseResolutions.isReserved,
    //   pCaseResolutions.isReserved ? pCaseResolutions.uploadAt : 'NOW()',
    //   pCaseResolutions.updatedBy,
    //   pCaseResolutions.id,
    // ]);
    // return result[1] ? true : false;
  }

  async remove(pCaseResolutions: CaseResolutions, queryRunner?: QueryRunner) {
    const sql = `
    UPDATE 
      case_resolutions
    SET
      status = $1, updated_by = $2, updated_at = NOW()
    WHERE 
      id = $3
    RETURNING *
        `;
    const result = await pgQuery(queryRunner || this.dbMaster, sql, [
      CaseResolutions.STATUS.CLOSE,
      pCaseResolutions.updatedBy,
      pCaseResolutions.id,
    ]);
    return result[1] ? true : false;
  }

  async findAll(pCaseResolutions: CaseResolutions, queryRunner?: QueryRunner) {
    //     pCaseResolutions.page = pCaseResolutions.page ?? 1;
    //     const offset = ((pCaseResolutions.page ? pCaseResolutions.page : 1) - 1) * CaseResolutions.limit;
    //     let bindNum = 0;

    //     const sql = `
    // SELECT
    // 	T1.id,
    // 	T1.case_id, 
    // 	T2.name AS case_name,
    // 	T1.type,
    // 	T1.title,
    // 	T1.upload_at,
    // 	T1.created_by,
    // 	T1.updated_by,
    // 	T1.created_at,
    // 	T1.updated_at
    // FROM
    // 	case_resolutions T1
    // INNER JOIN cases T2 ON
    // 	T2.id = T1.case_id AND T2.status >= 7
    // WHERE
    // 	T1.status = $${++bindNum} AND T1.upload_at <= NOW() ${pCaseResolutions.title ? `AND T1.title LIKE '%${pCaseResolutions.title}%'` : ''
    //       } ${pCaseResolutions.type >= 0 ? `AND T1.type = ${pCaseResolutions.type}` : ''} ${pCaseResolutions.caseId ? `AND T1.case_id = ${pCaseResolutions.caseId}` : ''
    //       } ORDER BY T1.upload_at DESC, T1.id DESC
    // LIMIT $${++bindNum} OFFSET $${++bindNum}
    //         `;
    //     const data = await this.dbSlave1.query(
    //       sql,
    //       [CaseResolutions.STATUS.OPEN, CaseResolutions.limit, offset],
    //       queryRunner,
    //     );
    //     return this.dataMapper.castList<CaseResolutions>(data);
  }

  async findCnt(pCaseResolutions: CaseResolutions, queryRunner?: QueryRunner) {
    //     let bindNum = 0;
    //     const data = await this.dbSlave1.query(
    //       `
    // SELECT
    // 	COUNT(*) AS CNT
    // FROM
    // 	case_resolutions T1
    // WHERE
    // 	T1.status = $${++bindNum} AND T1.upload_at <= NOW() 
    //   ${pCaseResolutions.title ? `AND T1.title LIKE '%${pCaseResolutions.title}%'` : ''} 
    //       ${pCaseResolutions.type >= 0 ? `AND T1.type = ${pCaseResolutions.type}` : ''} 
    //       ${pCaseResolutions.caseId ? `AND T1.case_id = ${pCaseResolutions.caseId}` : ''}
    //     `,
    //       [CaseResolutions.STATUS.OPEN],
    //       queryRunner,
    //     );
    //     return this.dataMapper.cast<CaseResolutions>(data);
  }

}
