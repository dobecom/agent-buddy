import { BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { ErrorCodes } from '../code/error/error.code';

// Master Node DML 작업을 위한 pg error code handling 함수
// https://www.postgresql.org/docs/current/errcodes-appendix.html
export const pgQuery = async (executor: DataSource | QueryRunner, query: string, params: any[]) => {
  try {
    return await executor.query(query, params);
  } catch (err) {
    switch (err.code) {
      case '23503':
        // Foreign Key Constraint
        throw new BadRequestException({
          code: ErrorCodes.BR013,
        });
      case '23505':
        // Unique Constraint
        throw new ConflictException({
          code: ErrorCodes.CF001,
        });
      default:
        if ('isTransactionActive' in executor) {
          throw new InternalServerErrorException({
            code: ErrorCodes.IS002,
          });
        } else {
          throw new InternalServerErrorException({
            code: ErrorCodes.IS001,
          });
        }
    }
  }
};
