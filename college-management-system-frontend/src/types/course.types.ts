import type { IResponse } from './global.types';

export interface ICourseData {
    code: string;
    name: string;
    creditHours: number;
    department: string;
    semester: number;
    program: string;
}

export interface ICourseResponse extends IResponse {
    code: string;
    name: string;
    creditHours: number;
    department: string;
    semester: number;
    program: string;
}
