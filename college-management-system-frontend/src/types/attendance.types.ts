import type { AttendanceStatus } from './enum';
import type { IResponse } from './global.types';
import type { IClassResponse } from './class.types';
import type { ICourseResponse } from './course.types';
import type { IStudentResponse } from './student.types';

export interface IAttendanceData {
    _id?:string;
    student: string;
    class: string;
    course: string;
    date: Date | string;
    status: string;
    remarks?: string;
}

export interface IAttendanceResponse extends IResponse {
    student: IStudentResponse;
    class: IClassResponse;
    course: ICourseResponse;
    date: Date | string;
    status: AttendanceStatus;
    remarks?: string;
}
