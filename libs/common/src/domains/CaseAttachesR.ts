import { CaseAttachesREntity } from './Entity';

enum TYPE {
  BROWSER = 'BROWSER',
  WEBAPPS = 'WEBAPPS',
}

// 케이스 첨부파일 정보 Relation DTO
export class CaseAttachesR extends CaseAttachesREntity {
  // Enum
  static readonly TYPE = TYPE;

  constructor() {
    super();
  }
}
