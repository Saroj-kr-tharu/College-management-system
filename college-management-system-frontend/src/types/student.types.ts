import type { IClassResponse } from './class.types';
import type { ICourseResponse } from './course.types';
import type { Gender } from './enum';
import type { IImage, IResponse } from './global.types';

export interface IStudentData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dob: Date | string;
    gender: Gender;
    rollNumber: string;
    registrationNumber: string;
    program: string;
    semester: number;
    courses?: string[];
    classes?: string[];
    profile: File | FileList;
}

export interface IStudentResponse extends IResponse {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dob: Date | string;
    gender: Gender;
    rollNumber: string;
    registrationNumber: string;
    program: string;
    semester: number;
    classes ?: IClassResponse[];
    courses?: ICourseResponse[];
    profile: IImage;
}


