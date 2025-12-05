
export class CaseAttachesEntity {
  id: string;
  url: string;
  path: string;
  name: string;
  original: string;
  memo: string | null;
  // WAIT / VERIFY / DELETE
  status: string;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export class CaseAttachesREntity {
  caseId: string;
  attachId: string;
  seq: number;
  // BROWSER / WEBAPPS
  type: string;
}

export class CaseResolutionsEntity {
  id: string;
  caseId: string;
  content: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export class CaseStatementsEntity {
  id: string;
  caseId: string;
  symptom: string;
  needs: string;
  environments: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export class CasesEntity {
  id: string;
  number: string;
  productFamily: string;
  productName: string;
  productVersion: string | null;
  category: string | null;
  subCategory: string | null;
  title: string;
  // OPEN / PROCESSING / PROCESSED / CLOSE
  status: string;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export class UsersEntity {
  id: string;
  identifier: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  // MEMBER / ADMIN
  grade: string;
  // WAIT / VERIFY / DELETE
  status: string;
  signFail: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}
