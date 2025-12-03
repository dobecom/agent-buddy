import { CaseResolutionsEntity } from './Entity';

enum STATUS {
  OPEN,
  PROCESSING,
  PROCESSED,
  CLOSE,
}

// 케이스 가이드 정보 DTO
export class CaseResolutions extends CaseResolutionsEntity {
  // Enum
  static readonly STATUS = STATUS;

  // Add Var
  static readonly limit = 10;
  page: number;

  constructor() {
    super();
  }
}
