import * as yup from 'yup';
import { AttendanceStatus } from '../types/enum';

export const AttendanceSchema = yup.object({
    student: yup.string().required('Student ID is required'),
    class: yup.string().required('Class ID is required'),
    course: yup.string().required('Course ID is required'),
    date: yup.date().required('Date is required'),
    status: yup.mixed<AttendanceStatus>().oneOf(Object.values(AttendanceStatus), 'Invalid attendance status').required('Attendance status is required'),
    remarks: yup.string().optional()
});
