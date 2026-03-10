import * as yup from 'yup';

export const ClassSchema = yup.object({
    name: yup.string().required('Class name is required'),
    program: yup.string().required('Program is required'),
    semester: yup.number().min(1, 'Semester must be at least 1').max(8, 'Semester cannot exceed 8').required('Semester is required'),
    students: yup.array().of(yup.string()).optional(),
    courses: yup.array().of(yup.string()).optional(),
    teacher: yup.string().optional(),
    isActive: yup.boolean().default(true)
})
