import * as yup from 'yup';

export const CourseSchema = yup.object({
    code: yup.string().required('Course code is required'),
    name: yup.string().required('Course name is required'),
    creditHours: yup.number().min(1, 'Credit hours must be at least 1').max(6, 'Credit hours cannot exceed 6').required('Credit hours are required'),
    department: yup.string().required('Department is required'),
    semester: yup.number().min(1, 'Semester must be at least 1').max(8, 'Semester cannot exceed 8').required('Semester is required'),
    program: yup.string().required('Program is required'),
    isActive: yup.boolean().default(true)
})
