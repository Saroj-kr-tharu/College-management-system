import * as yup from 'yup';
import { Gender } from '../types/enum';

export const StudentSchema = yup.object({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().required('Email is required').email('Invalid email format'),
    phone: yup.string().required('Phone number is required').matches(
        /^(97|98)[0-9]{8}$/,
        'Enter a valid Nepali mobile number (97XXXXXXXX or 98XXXXXXXX)'
    ),
    address: yup.string().required('Address is required'),
    dob: yup.date().required('Date of birth is required').max(new Date(), 'Date of birth cannot be in the future'),
    gender: yup.mixed<Gender>().oneOf(Object.values(Gender), 'Invalid gender').required('Gender is required'),
    rollNumber: yup.string().required('Roll number is required'),
    registrationNumber: yup.string().required('Registration number is required'),
    program: yup.string().required('Program is required'),
    semester: yup.number().min(1, 'Semester must be at least 1').max(8, 'Semester cannot exceed 8').required('Semester is required'),
    courses: yup.array().of(yup.string()).optional(),
    classes: yup.array().of(yup.string()).optional(),
    profile: yup.mixed().required('Profile is required'),
    isActive: yup.boolean().default(true)
})
