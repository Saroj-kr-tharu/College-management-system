export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER'
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER'
}

export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LEAVE = 'LEAVE',
}

export enum Program {
    BCA = 'BCA',
    BEIT = 'BE-IT',
    BECMP = 'BE-CMP',
    BECIVIL = 'BE-CIVIL',
}

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const PROGRAMS = Object.values(Program).map((p) => ({
    label: p,
    value: p,
}));

export const SEMESTER_OPTIONS = SEMESTERS.map((s) => ({
    label: `Semester ${s}`,
    value: String(s),
}));
