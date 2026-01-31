import * as yup from 'yup';

export const LoginSchema = yup.object ({
    email: yup.string().required('Email is required').email('Invalid email format'),
    password: yup.string().required('Password is required')
})

export const SignupSchema = yup.object ({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().required('Email is required').email('Invalid email format'),
    password: yup.string().required('Password is required'),
    phone: yup.string().optional()
})
