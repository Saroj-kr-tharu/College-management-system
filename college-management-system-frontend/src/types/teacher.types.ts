import type { Gender } from './enum';
import type { ICourseResponse } from './course.types';
import type { IImage, IResponse } from './global.types';

export interface ITeacherData {
    fullName: string;
    email: string;
    phone: string;
    gender: Gender;
    department: string;
    courses?: string[];
    profile: File | FileList;
}

export interface ITeacherResponse extends IResponse {
    fullName: string;
    email: string;
    phone: string;
    gender: Gender;
    department: string;
    courses?: ICourseResponse[];
    profile: IImage;
}
