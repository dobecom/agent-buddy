import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataMapper } from '@app/common/utils/data.mapper';
import { pgQuery } from '@app/common/utils/pg.query';
import { CaseStatements } from '@app/common/domains/CaseStatements';

@Injectable()
export class CaseStatementsRepository {
  constructor(
    @InjectDataSource('DB_MASTER')
    private dbMaster: DataSource,
    @InjectDataSource('DB_SLAVE1')
    private dbSlave1: DataSource,
    private dataMapper: DataMapper,
  ) { }

  async create(pCaseStatements: CaseStatements, queryRunner?: QueryRunner) {
    const result = await pgQuery(
      queryRunner || this.dbMaster,
      `
INSERT INTO case_statements (case_id, symptom, needs, environments, created_at, created_by, updated_at, updated_by) 
VALUES ($1, $2, $3, $4, NOW(), $5, NOW(), $6)
RETURNING id
        `,
      [
        pCaseStatements.caseId,
        pCaseStatements.symptom,
        pCaseStatements.needs,
        pCaseStatements.environments,
        pCaseStatements.createdBy ?? 'system',
        pCaseStatements.updatedBy ?? 'system',
      ]

    );
    return result[0] && result[0].id ? result[0].id : 0;
  }

  async find(pCaseStatements: CaseStatements, queryRunner?: QueryRunner) {
    const data = await this.dbSlave1.query(
      `
SELECT
  T1.case_id, 
  (SELECT "name" FROM cases WHERE id = T1.case_id) AS case_name,
  ARRAY[T1.attach_id1, T1.attach_id2, T1.attach_id3, T1.attach_id4, T1.attach_id5],
  T1.type, T1.title, T1.content, T1.is_reserved, T1.upload_at, T1.created_by, T1.updated_by, T1.created_at, T1.updated_at
FROM
  case_statements T1
WHERE
  T1.id = $1
  AND T1.status = $2
    `,
      [pCaseStatements.id, CaseStatements.STATUS.OPEN],
      queryRunner,
    );
    return this.dataMapper.cast<CaseStatements>(data);
  }

  async alter(pCaseStatements: CaseStatements, queryRunner?: QueryRunner) {
    // SQL
    let bindNum = 0;
    const sql = `
 UPDATE 
   case_statements
 SET
   case_id = $${++bindNum}, attach_id1 = $${++bindNum}, attach_id2 = $${++bindNum}, attach_id3 = $${++bindNum}, attach_id4 = $${++bindNum}, attach_id5 = $${++bindNum}, 
   "type" = $${++bindNum}, title = $${++bindNum}, "content" = $${++bindNum}, is_reserved = $${++bindNum}, upload_at = $${++bindNum}, updated_by = $${++bindNum}, updated_at = NOW()
 WHERE 
   id = $${++bindNum} 
 RETURNING *
     `;

    // Execute
    // const result = await pgQuery(queryRunner || this.dbMaster, sql, [
    //   pCaseStatements.caseId,
    //   pCaseStatements.attachIdList[0],
    //   pCaseStatements.attachIdList[1],
    //   pCaseStatements.attachIdList[2],
    //   pCaseStatements.attachIdList[3],
    //   pCaseStatements.attachIdList[4],
    //   pCaseStatements.type,
    //   pCaseStatements.title,
    //   pCaseStatements.content,
    //   pCaseStatements.isReserved,
    //   pCaseStatements.isReserved ? pCaseStatements.uploadAt : 'NOW()',
    //   pCaseStatements.updatedBy,
    //   pCaseStatements.id,
    // ]);
    // return result[1] ? true : false;
  }

  async remove(pCaseStatements: CaseStatements, queryRunner?: QueryRunner) {
    const sql = `
    UPDATE 
      case_statements
    SET
      status = $1, updated_by = $2, updated_at = NOW()
    WHERE 
      id = $3
    RETURNING *
        `;
    const result = await pgQuery(queryRunner || this.dbMaster, sql, [
      CaseStatements.STATUS.CLOSE,
      pCaseStatements.updatedBy,
      pCaseStatements.id,
    ]);
    return result[1] ? true : false;
  }

  async findAll(pCaseStatements: CaseStatements, queryRunner?: QueryRunner) {
    //     pCaseStatements.page = pCaseStatements.page ?? 1;
    //     const offset = ((pCaseStatements.page ? pCaseStatements.page : 1) - 1) * CaseStatements.limit;
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
    // 	case_statements T1
    // INNER JOIN cases T2 ON
    // 	T2.id = T1.case_id AND T2.status >= 7
    // WHERE
    // 	T1.status = $${++bindNum} AND T1.upload_at <= NOW() ${pCaseStatements.title ? `AND T1.title LIKE '%${pCaseStatements.title}%'` : ''
    //       } ${pCaseStatements.type >= 0 ? `AND T1.type = ${pCaseStatements.type}` : ''} ${pCaseStatements.caseId ? `AND T1.case_id = ${pCaseStatements.caseId}` : ''
    //       } ORDER BY T1.upload_at DESC, T1.id DESC
    // LIMIT $${++bindNum} OFFSET $${++bindNum}
    //         `;
    //     const data = await this.dbSlave1.query(
    //       sql,
    //       [CaseStatements.STATUS.OPEN, CaseStatements.limit, offset],
    //       queryRunner,
    //     );
    //     return this.dataMapper.castList<CaseStatements>(data);
  }

  async findCnt(pCaseStatements: CaseStatements, queryRunner?: QueryRunner) {
    //     let bindNum = 0;
    //     const data = await this.dbSlave1.query(
    //       `
    // SELECT
    // 	COUNT(*) AS CNT
    // FROM
    // 	case_statements T1
    // WHERE
    // 	T1.status = $${++bindNum} AND T1.upload_at <= NOW() 
    //   ${pCaseStatements.title ? `AND T1.title LIKE '%${pCaseStatements.title}%'` : ''} 
    //       ${pCaseStatements.type >= 0 ? `AND T1.type = ${pCaseStatements.type}` : ''} 
    //       ${pCaseStatements.caseId ? `AND T1.case_id = ${pCaseStatements.caseId}` : ''}
    //     `,
    //       [CaseStatements.STATUS.OPEN],
    //       queryRunner,
    //     );
    //     return this.dataMapper.cast<CaseStatements>(data);
  }

}
