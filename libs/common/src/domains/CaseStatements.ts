import { CaseStatementsEntity } from './Entity';

enum STATUS {
  OPEN,
  PROCESSING,
  PROCESSED,
  CLOSE,
}

// 케이스 설명 정보 DTO
export class CaseStatements extends CaseStatementsEntity {
  // Enum
  static readonly STATUS = STATUS;

  // Add Var
  static readonly limit = 10;
  page: number;

  constructor() {
    super();
  }
}
