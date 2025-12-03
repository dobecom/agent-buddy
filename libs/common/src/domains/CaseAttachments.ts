import { CaseAttachmentsEntity } from './Entity';

enum STATUS {
  OPEN,
  PROCESSING,
  PROCESSED,
  CLOSE,
}

// 케이스 첨부파일 정보 DTO
export class CaseAttachments extends CaseAttachmentsEntity {
  // Enum
  static readonly STATUS = STATUS;

  // Add Var
  static readonly limit = 10;
  page: number;

  constructor() {
    super();
  }
}
