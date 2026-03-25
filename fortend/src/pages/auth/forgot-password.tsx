import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { forgotPassword } from '../../api/auth.api';
import Input from '../../components/common/inputs/input';
import { ForgotPasswordSchema } from '../../schema/auth.schema';
import type { IForgotPassword } from '../../types/auth.types';

const ForgotPassword = () => {
  const methods = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(ForgotPasswordSchema),
    mode: 'all',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      toast.success(response?.message ?? 'New password sent to your email');
      methods.reset();
    },
    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? 'Failed to send reset email');
    },
  });

  const onSubmit = (data: IForgotPassword) => {
    mutate(data);
  };

  return (
    <main
      className='min-h-screen w-full flex justify-center items-center
                  bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600
                  px-4'
    >
      <div
        className='w-full max-w-md bg-white/90 backdrop-blur-sm
                    rounded-2xl shadow-2xl p-8'
      >
        {/* Icon */}
        <div className='flex justify-center mb-4'>
          <div className='w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg'>
            <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className='text-3xl font-extrabold text-gray-900 text-center mb-3'>
          Forgot Password?
        </h1>
        <p className='text-center text-gray-600 mb-8'>
          Enter your email and we'll send you a new password
        </p>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-4'>
              <Input
                label='Email Address'
                id='email'
                name='email'
                type='email'
                placeholder='Enter your registered email'
                required
              />

              <button
                type='submit'
                disabled={isPending}
                className='cursor-pointer w-full bg-gradient-to-r from-indigo-500 to-blue-600 py-3 rounded-md text-white font-semibold text-lg hover:from-indigo-400 hover:to-blue-500 transition-all duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {isPending ? 'Sending...' : 'Send New Password'}
              </button>
            </div>
          </form>
        </FormProvider>

        {/* Back to Login */}
        <div className='mt-6 text-center'>
          <Link
            to='/login'
            className='text-violet-700 font-semibold hover:underline inline-flex items-center gap-2'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
