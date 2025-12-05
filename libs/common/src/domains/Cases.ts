import { CasesEntity } from './Entity';

enum STATUS {
  OPEN,
  PROCESSING,
  PROCESSED,
  CLOSE,
}

// 케이스정보 DTO
export class Cases extends CasesEntity {
  // Enum
  static readonly STATUS = STATUS;

  // Add Var
  static readonly limit = 10;
  page: number;

  statementIdList: string[];
  attachIdList: string[];
  resolutionIdList: string[];

  constructor() {
    super();
  }
}
