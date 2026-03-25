// Mark sub-document (populated from Mark model)
export interface IMark {
  _id: string;
  student: string;
  course: {
    _id: string;
    name: string;
    code: string;
  } | string;
  examYear: number;
  examType: string; // "REGULAR" | "BACK"
  mark: number;
  grade: string;
  isAbsent: boolean;
}

// Result as returned by the API (populated)
export interface IResult {
  _id: string;
  student: { _id: string; fullName: string; email: string } | string;
  class: { _id: string; name: string } | string;
  program: string;
  semester: number;
  cgpa: number;
  overallStatus: string; // "PASS" | "FAIL"
  marks: IMark[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Payload sent when creating a result
export interface IMarkInput {
  course: string;       // ObjectId
  examYear: number;
  examType: string;     // "REGULAR" | "BACK"
  mark: number;
  isAbsent?: boolean;
}

export interface ICreateResultPayload {
  student: string;      // ObjectId
  class: string;        // ObjectId
  program: string;
  semester: number;
  marks: IMarkInput[];
}
