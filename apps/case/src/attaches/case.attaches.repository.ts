import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataMapper } from '@app/common/utils/data.mapper';
import { CaseAttaches } from '@app/common/domains/CaseAttaches';
import { pgQuery } from '@app/common/utils/pg.query';
import { CaseAttachesR } from '@app/common/domains/CaseAttachesR';

@Injectable()
export class CaseAttachesRepository {
  constructor(
    @InjectDataSource('DB_MASTER')
    private dbMaster: DataSource,
    @InjectDataSource('DB_SLAVE1')
    private dbSlave1: DataSource,
    private dataMapper: DataMapper,
  ) { }

  /** CRUD : create > findAll > find > findCnt > alter > remove */

  async createBiz(pCaseAttaches: CaseAttaches, queryRunner?: QueryRunner) {
    const sql = `
INSERT INTO products_attaches 
  (url, path, name, original, status, created_by, created_at)
VALUES
  ($1, $2, $3, $4, $5, $6, NOW())
RETURNING id
        `;

    const result = await pgQuery(queryRunner || this.dbMaster, sql, [
      pCaseAttaches.url,
      pCaseAttaches.path,
      pCaseAttaches.name,
      pCaseAttaches.original,
      CaseAttaches.STATUS.WAIT,
      pCaseAttaches.createdBy,
    ]);
    return result[0] && result[0].id ? result[0].id : 0;
  }

  async create(pCaseAttaches: CaseAttaches, queryRunner?: QueryRunner) {
    const params = [
      pCaseAttaches.url,
      pCaseAttaches.name,
      pCaseAttaches.original,
      CaseAttaches.STATUS.WAIT,
      pCaseAttaches.createdBy,
    ];

    const sql = `
INSERT INTO products_attaches 
  (url, name, original, status, created_by, created_at)
VALUES
  ($1, $2, $3, $4, $5, NOW())
RETURNING id
        `;

    const result = await pgQuery(queryRunner || this.dbMaster, sql, params);
    return result[0] && result[0].id ? result[0].id : 0;
  }

  async findAllByIds(ids: string[], queryRunner?: QueryRunner) {
    const data = await this.dbSlave1.query(
      `
SELECT
  id,
	url,
	name,
	original
FROM
	products_attaches
WHERE
  id IN (${ids.map((item) => `${item}`).join(', ')})
  AND status >= $1
  ;
    `,
      [CaseAttaches.STATUS.VERIFY],
      queryRunner,
    );
    return this.dataMapper.castList<CaseAttaches>(data);
  }

  async findAllBiz(pCaseAttaches: CaseAttaches, queryRunner?: QueryRunner) {
    const data = await this.dbSlave1.query(
      `
SELECT
	DISTINCT ON (T1.type) type,
	T1.attach_id AS id,
	T2.url,
	T2.name,
	T2.original,
	T2.status
FROM
	products_attaches_r T1
JOIN products_attaches T2 ON
	T2.id = T1.attach_id
	AND status >= $1
WHERE
	T1.product_id = $2
ORDER BY
	TYPE, T1.attach_id;
    `,
      [CaseAttaches.STATUS.WAIT, pCaseAttaches.caseId],
      queryRunner,
    );
    return this.dataMapper.castList<CaseAttaches>(data);
  }

  async findCntBiz(pCaseAttaches: CaseAttaches, queryRunner?: QueryRunner) {
    const data = await this.dbSlave1.query(
      `
SELECT
	COUNT(*) CNT
FROM
	(
	SELECT
		DISTINCT ON
		(T1.type) TYPE,
		T1.attach_id AS id,
		T1.seq,
		T2.url,
		T2.name,
		T2.original,
		T2.status
	FROM
		products_attaches_r T1
	JOIN products_attaches T2 ON
		T2.id = T1.attach_id
		AND status >= $1
	WHERE
		T1.product_id = $2);
    `,
      [CaseAttaches.STATUS.VERIFY, pCaseAttaches.caseId],
      queryRunner,
    );
    return this.dataMapper.cast<CaseAttaches>(data);
  }

  async findAll(pCaseAttaches: CaseAttaches, queryRunner?: QueryRunner) {
    const data = await this.dbSlave1.query(
      `
SELECT
	T1.attach_id AS id,
  T1.type,
	T2.url,
  T2.path,
	T2.name,
	T2.original,
	T2.status
FROM
	products_attaches_r T1
JOIN products_attaches T2 ON
	T2.id = T1.attach_id
	AND status >= $1
WHERE
	T1.product_id = $2
ORDER BY
	TYPE, T1.attach_id;
    `,
      [CaseAttaches.STATUS.VERIFY, pCaseAttaches.caseId],
      queryRunner,
    );
    return this.dataMapper.castList<CaseAttaches>(data);
  }

  async findCnt(pCaseAttaches: CaseAttaches, queryRunner?: QueryRunner) {
    const data = await this.dbSlave1.query(
      `
SELECT
	COUNT(*) AS CNT
FROM
	products_attaches_r T1
JOIN products_attaches T2 ON
	T2.id = T1.attach_id
	AND T2.status >= $1
WHERE
	T1.product_id = $2;
    `,
      [CaseAttaches.STATUS.VERIFY, pCaseAttaches.caseId],
      queryRunner,
    );
    return this.dataMapper.cast<CaseAttaches>(data);
  }

  async alterForRegisterByIds(ids: string[], queryRunner?: QueryRunner) {
    const sql = `
UPDATE 
  products_attaches 
SET 
  status = $1
WHERE
  id IN (${ids.map((item) => `${item}`).join(', ')})
      `;
    const result = await pgQuery(queryRunner || this.dbMaster, sql, [CaseAttaches.STATUS.VERIFY]);
    return result[1] > 0 ? true : false;
  }

  async removeByIds(ids: string[], queryRunner?: QueryRunner) {
    const sql = `
UPDATE 
  products_attaches
SET 
  status = $1
WHERE
  id IN (${ids.map((item) => `${item}`).join(', ')})
        `;
    const result = await pgQuery(queryRunner || this.dbMaster, sql, [CaseAttaches.STATUS.DELETE]);
    return result[1] > 0 ? true : false;
  }
}
