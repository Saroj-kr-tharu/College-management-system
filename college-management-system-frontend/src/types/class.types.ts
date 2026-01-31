import type { IResponse } from './global.types';
import type { ICourseResponse } from './course.types';
import type { IStudentResponse } from './student.types';
import type { ITeacherResponse } from './teacher.types';

export interface IClassData {
    _id?: string;
    name: string;
    program: string;
    semester: number;
    students?: string[];
    courses?: string[];
    teacher?: string;
}

export interface IClassResponse extends IResponse {
    name: string;
    program: string;
    semester: number;
    students?: IStudentResponse[];
    courses?: ICourseResponse[];
    teacher?: ITeacherResponse;
}
