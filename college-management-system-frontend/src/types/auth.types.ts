import type { Role } from './enum';
import type { IResponse } from './global.types';

export interface ILoginData {
    email: string;
    password: string;
}

export interface IChangePassword {
    new_password: string;
    old_password: string;
}

export interface ISignupData {
    fullName: string;
    email: string;
    password: string;
    phone_number?: string;
}

export interface IUser extends IResponse {
    fullName: string;
    email: string;
    role: Role;
    password: string;
    phone_number?: string;
}
