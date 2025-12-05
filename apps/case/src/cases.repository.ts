import { Cases } from '@app/common/domains/Cases';
import { DataMapper } from '@app/common/utils/data.mapper';
import { pgQuery } from '@app/common/utils/pg.query';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class CasesRepository {
  constructor(
    @InjectDataSource('DB_MASTER')
    private dbMaster: DataSource,
    @InjectDataSource('DB_SLAVE1')
    private dbSlave1: DataSource,
    private dataMapper: DataMapper,
  ) { }

  /** CRUD : create > findAll > find > findCnt > alter > remove */
  async create(pCases: Cases, queryRunner?: QueryRunner) {
    const sql = `
INSERT INTO cases (id,"number",product_family,product_name,product_version,category,sub_category,title,status,created_at,created_by,updated_at,updated_by) 
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),$10,NOW(),$11)
RETURNING id
        `;
    const result = await pgQuery(queryRunner || this.dbMaster, sql, [
      pCases.id,
      pCases.number,
      pCases.productFamily,
      pCases.productName,
      pCases.productVersion,
      pCases.category,
      pCases.subCategory,
      pCases.title,
      pCases.status,
      pCases.createdBy ?? 'system',
      pCases.updatedBy ?? 'system',
    ]);
    return result[0] && result[0].id ? result[0].id : 0;
  }

  async find(pCases: Cases, queryRunner?: QueryRunner) {
    //     const data = await this.dbSlave1.query(
    //       `
    // SELECT
    //   T2.id AS business_id, T2.key AS business_key,
    //   T1.member_id, T1.investment_id, T1.settlement_id, T1.category_id, 
    //   T1.business_name, T1.category_id, T1.category_name, T1.investment_name, T1.settlement_name,
    //   T1.name, T1.stock, T1.model, T1.amount, T1.price, T1.total, T1.quantity, T1.remain, 
    //   T1.min_limit, T1.max_limit, T1.start_at, T1.end_at, T1.allot_at, T1.issued_by,
    //   T1.status, T1.status_subscription, T1.created_by, T1.updated_by, T1.created_at, T1.updated_at,
    //   (SELECT CONCAT(url, '/lg/', name) FROM cases_images T3 WHERE T3.id = T1.image_id) AS image,
    //   T3.url AS image_url, T3.name AS image_name
    // FROM 
    //   cases T1
    // INNER JOIN business T2 
    //   ON T2.id = T1.business_id
    // LEFT OUTER JOIN cases_images T3 
    //   ON T3.id = T1.image_id
    // WHERE 
    //   1 = 1 
    //   AND T1.id = $1
    //   AND T1.status >= $2
    // LIMIT 1
    //     `,
    //       [pCases.id, Cases.STATUS.REJECT],
    //       queryRunner,
    //     );
    //     return this.dataMapper.cast<Cases>(data);
  }

  async findAll(pCases: Cases, queryRunner?: QueryRunner) {
    //     const offset = ((pCases.page ? pCases.page : 1) - 1) * Cases.limit;
    //     // SQL
    //     let bindNum = 0;
    //     const conditions = [];
    //     if (pCases.investmentId) {
    //       conditions.push(`AND T1.investment_id = $${++bindNum}`);
    //     }
    //     // if (pCases.categoryId) {
    //     //   conditions.push(`AND T1.category_id = $${++bindNum}`);
    //     // }
    //     if (pCases.name) {
    //       conditions.push(`AND T1.name LIKE $${++bindNum}`);
    //     }
    //     if (pCases.model) {
    //       conditions.push(`AND T1.model LIKE $${++bindNum}`);
    //     }
    //     const sql = `
    // SELECT
    //   T1.id, 
    //   (SELECT key FROM business WHERE id = (SELECT business_id FROM business_categories WHERE id = (SELECT category_id FROM cases WHERE id = T1.id))) AS business_key,
    //   T1.member_id, T1.investment_id, T1.settlement_id, T1.category_id, 
    //   T1.business_name, T1.category_name, T1.investment_name, T1.settlement_name, 
    //   T1.name, T1.stock, T1.model, T1.amount, T1.price, T1.total, T1.quantity, T1.remain, T1.status, T1.created_by, T1.updated_by, T1.created_at, T1.updated_at, 
    //   (SELECT CONCAT(url, '/lg/', name) FROM cases_images T3 WHERE T3.id = T1.image_id) AS image,
    //   T2.url AS image_url, T2.name AS image_name
    // FROM 
    //   cases T1
    // LEFT OUTER JOIN cases_images T2 
    //   ON T2.id = T1.image_id
    // WHERE 
    //   1 = 1 
    //   AND T1.status >= $${++bindNum} ${conditions.join(' ')}
    // ORDER BY id DESC 
    // LIMIT $${++bindNum} OFFSET $${++bindNum}    
    //     `;
    //     // Bind
    //     const bind = [];
    //     if (pCases.investmentId) bind.push(pCases.investmentId);
    //     // if (pCases.categoryId) bind.push(pCases.categoryId);
    //     if (pCases.name) bind.push(`%${pCases.name}%`);
    //     if (pCases.model) bind.push(`%${pCases.model}%`);
    //     bind.push(pCases.status >= 0 ? pCases.status : Cases.STATUS.REJECT);
    //     bind.push(Cases.limit, offset);
    //     // Execute
    //     const data = await this.dbSlave1.query(sql, bind, queryRunner);
    //     return this.dataMapper.castList<Cases>(data);
  }

  async findCnt(pCases: Cases, queryRunner?: QueryRunner) {
    //     // SQL
    //     let bindNum = 0;
    //     const conditions = [];
    //     if (pCases.investmentId) {
    //       conditions.push(`AND T1.investment_id = $${++bindNum}`);
    //     }
    //     // if (pCases.categoryId) {
    //     //   conditions.push(`AND T1.category_id = $${++bindNum}`);
    //     // }
    //     if (pCases.name) {
    //       conditions.push(`AND T1.name LIKE $${++bindNum}`);
    //     }
    //     if (pCases.model) {
    //       conditions.push(`AND T1.model LIKE $${++bindNum}`);
    //     }
    //     const sql = `
    // SELECT
    //   COUNT(*) AS CNT
    // FROM 
    //   cases T1
    // WHERE 
    //   1 = 1 
    //   AND T1.status >= $${++bindNum} ${conditions.join(' ')}
    //     `;
    //     // Bind
    //     const bind = [];
    //     if (pCases.investmentId) bind.push(pCases.investmentId);
    //     // if (pCases.categoryId) bind.push(pCases.categoryId);
    //     if (pCases.name) bind.push(`%${pCases.name}%`);
    //     if (pCases.model) bind.push(`%${pCases.model}%`);
    //     bind.push(pCases.status >= 0 ? pCases.status : Cases.STATUS.REJECT);
    //     // Execute
    //     const data = await this.dbSlave1.query(sql, bind, queryRunner);
    //     return this.dataMapper.cast<Cases>(data);
  }


  async alterCases(pCases: Cases, queryRunner?: QueryRunner) {
    //     // SQL
    //     let bindNum = 0;
    //     const sql = `
    //  UPDATE 
    //    cases
    //  SET
    //    updated_by = $${++bindNum}, updated_at = NOW() 
    //    ${pCases.investmentId ? `, investment_id = $${++bindNum}` : ''} 
    //    ${pCases.name ? `, name = $${++bindNum}` : ''} 
    //    ${pCases.stock ? `, stock = $${++bindNum}` : ''} 
    //    ${pCases.investmentName ? `, investment_name = $${++bindNum}` : ''} 
    //    ${pCases.status >= 0 ? `, status = $${++bindNum}` : ''}
    //    ${pCases.code ? `, code = $${++bindNum}` : ''}
    //     ${pCases.description ? `, description = $${++bindNum}` : ''}
    //     ${pCases.issueAt ? `, issue_at = $${++bindNum}` : ''}
    //     ${pCases.startAt ? `, start_at = $${++bindNum}` : ''}
    //     ${pCases.endAt ? `, end_at = $${++bindNum}` : ''}
    //     ${pCases.amount ? `, amount = $${++bindNum}` : ''}
    //     ${pCases.listingFee ? `, listing_fee = $${++bindNum}` : ''}
    //     ${pCases.trustFee ? `, trust_fee = $${++bindNum}` : ''}
    //     ${pCases.assetHolder ? `, asset_holder = $${++bindNum}` : ''}
    //     ${pCases.issueCompany ? `, issue_company = $${++bindNum}` : ''}
    //     ${pCases.trustee ? `, trustee = $${++bindNum}` : ''}
    //     ${pCases.recipientAccount ? `, recipient_account = $${++bindNum}` : ''}
    //     ${pCases.distMethod ? `, dist_method = $${++bindNum}` : ''}
    //     ${pCases.distAt ? `, dist_at = $${++bindNum}` : ''}
    //     ${pCases.issuedBy ? `, issued_by = $${++bindNum}` : ''}
    //     ${pCases.total ? `, total = $${++bindNum}` : ''}
    //     ${pCases.remain ? `, remain = $${++bindNum}` : ''}
    //     ${pCases.price ? `, price = $${++bindNum}` : ''}
    //  WHERE 
    //    id = $${++bindNum} 
    //  RETURNING *
    //      `;

    //     const params = [];
    //     if (pCases.investmentId) {
    //       params.push(pCases.investmentId);
    //     }
    //     if (pCases.name) {
    //       params.push(pCases.name);
    //     }
    //     if (pCases.stock) {
    //       params.push(pCases.stock);
    //     }
    //     if (pCases.investmentName) {
    //       params.push(pCases.investmentName);
    //     }
    //     if (pCases.status >= 0) {
    //       params.push(pCases.status);
    //     }
    //     if (pCases.code) {
    //       params.push(pCases.code);
    //     }
    //     if (pCases.description) {
    //       params.push(pCases.description);
    //     }
    //     if (pCases.issueAt) {
    //       params.push(pCases.issueAt);
    //     }
    //     if (pCases.startAt) {
    //       params.push(pCases.startAt);
    //     }
    //     if (pCases.endAt) {
    //       params.push(pCases.endAt);
    //     }
    //     if (pCases.amount) {
    //       params.push(pCases.amount);
    //     }
    //     if (pCases.listingFee) {
    //       params.push(pCases.listingFee);
    //     }
    //     if (pCases.trustFee) {
    //       params.push(pCases.trustFee);
    //     }
    //     if (pCases.assetHolder) {
    //       params.push(pCases.assetHolder);
    //     }
    //     if (pCases.issueCompany) {
    //       params.push(pCases.issueCompany);
    //     }
    //     if (pCases.trustee) {
    //       params.push(pCases.trustee);
    //     }
    //     if (pCases.recipientAccount) {
    //       params.push(pCases.recipientAccount);
    //     }
    //     if (pCases.distMethod) {
    //       params.push(pCases.distMethod);
    //     }
    //     if (pCases.distAt) {
    //       params.push(pCases.distAt);
    //     }
    //     if (pCases.issuedBy) {
    //       params.push(pCases.issuedBy);
    //     }
    //     if (pCases.total) {
    //       params.push(pCases.total);
    //     }
    //     if (pCases.remain) {
    //       params.push(pCases.remain);
    //     }
    //     if (pCases.price) {
    //       params.push(pCases.price);
    //     }

    //     // Execute
    //     const result = await pgQuery(queryRunner || this.dbMaster, sql, [pCases.updatedBy, ...params, pCases.id]);
    //     return result[1] ? true : false;
  }

  async remove(pCases: Cases, queryRunner?: QueryRunner) {
    // const sql = `
    // UPDATE 
    //   cases
    // SET
    //   status = $1
    // WHERE 
    //   id = $2 
    // RETURNING *
    //     `;
    // const result = await pgQuery(queryRunner || this.dbMaster, sql, [Cases.STATUS.DELETE, pCases.id]);
    // return result[1] ? true : false;
  }

}
