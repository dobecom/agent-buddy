import { UsersEntity } from './Entity';

enum STATUS {
  WAIT = 'WAIT',
  VERIFY= 'VERIFY',
  DELETE = 'DELETE'
}

enum GRADE {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

// 회원정보 DTO
export class Users extends UsersEntity {
  // Enum
  static readonly STATUS = STATUS;
  static readonly GRADE = GRADE;
  // Cache Key
  static readonly keyAt = 'members:at:';
  static readonly keyRt = 'members:rt:';
  static readonly keySess = 'members:session:';
  static readonly keyExpire = 'members:expire:';
  static readonly keyVerify = 'members:verify:';
  static readonly tokenSplit = '||';
  // Add Var
  companyName: string;
  verifyKey: string;
  verifyCode: string;
  static readonly limit = 10;
  page: number;
  constructor() {
    super();
  }
}
