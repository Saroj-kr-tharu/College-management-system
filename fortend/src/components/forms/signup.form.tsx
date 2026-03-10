import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { signup } from '../../api/auth.api';
import { SignupSchema } from '../../schema/auth.schema';
import type { ISignupData } from '../../types/auth.types';
import Input from '../common/inputs/input';

const SignupForm = () => {

  const navigate = useNavigate();

  const methods = useForm({
      defaultValues: {
        fullName: '',
        email: '',
        password: '',
        phone: ''
      },
      resolver: yupResolver(SignupSchema),
      mode: 'all'
    });

  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      console.log(response);
      toast.success(response?.message ?? 'Signup Success');
      localStorage.setItem('token', JSON.stringify(response.data.data));

      navigate('/login');
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.message ?? 'Signup Failed');
    },
    mutationKey: ['signup_mutation']
  });

  const onSubmit = async (data: ISignupData) => {
    mutate(data);
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>

          <div className='flex flex-col'>

            {/* Full Name Field */}
            <Input
              label='Full Name'
              id='fullName'
              name='fullName'
              placeholder='Full Name'
              required
            />

            {/* Email Field */}
            <Input
              label='Email'
              id='email'
              name='email'
              placeholder='example@gmail.com'
              required
            />

            {/* Password Field */}
            <Input
              label='Password'
              id='password'
              name='password'
              type='password'
              placeholder='••••••••••••••••••••••'
              required
            />

            {/* Phone Number Field */}
            <Input
              label='Phone Number'
              id='phone'
              name='phone'
              placeholder='+977 ••••••••••'
              required={false}
            />

            {/* Register Button */}
            <div className='w-full mt-2'>
              <button
                type='submit'
                disabled={isPending}
                className='cursor-pointer w-full bg-gradient-to-r from-indigo-500 to-blue-600 py-3 rounded-md text-white font-semibold text-lg hover:from-indigo-400 hover:to-blue-500 transition-all duration-300 shadow-md'
              >
                SignUp
              </button>
            </div>

          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default SignupForm;
