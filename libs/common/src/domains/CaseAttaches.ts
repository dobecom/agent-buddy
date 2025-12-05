import { CaseAttachesEntity } from './Entity';

enum STATUS {
  WAIT = 'WAIT',
  VERIFY = 'VERIFY',
  DELETE = 'DELETE'
}

// 케이스 첨부파일 정보 DTO
export class CaseAttaches extends CaseAttachesEntity {
  // Enum
  static readonly STATUS = STATUS;

  // Add Var
  caseId: number;
  type: number;
  constructor() {
    super();
  }
}
