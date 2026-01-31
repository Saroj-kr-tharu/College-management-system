import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { useAuth } from '../../context/auth.context';
import Input from '../common/inputs/input';


import type { IChangePassword } from '../../types/auth.types';

import { ChangePassword } from '../../api/auth.api';


// Change Password Schema
const ChangePasswordSchema = yup.object().shape({
  old_password: yup.string().required('Current password is required'),
  new_password: yup
    .string()
    .required('New password is required'),
});



const ChangePasswordForm = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();


  const methods = useForm({
    defaultValues: {
      old_password: '',
      new_password: '',
    },
    resolver: yupResolver(ChangePasswordSchema),
    mode: 'all',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ChangePassword,
    onSuccess: (response) => {
      toast.success(response?.message ?? 'Password changed successfully');
      methods.reset();

      // local token remove
      localStorage.removeItem("token")

      // useAuth context remove 
      setUser(null );
      
      // login page 
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.message ?? 'Failed to change password');
    },
    mutationKey: ['change_password_mutation']
  });

  const onSubmit = (data: IChangePassword) => {
    mutate(data);
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className='flex flex-col'>
            {/* Current Password Field */}
            <Input
              label='old Password'
              id='old_password'
              name='old_password'
              type='password'
              placeholder='••••••••••••••••••••••'
              required
            />

            {/* New Password Field */}
            <Input
              label='New Password'
              id='new_password'
              name='new_password'
              type='password'
              placeholder='••••••••••••••••••••••'
              required
            />

            {/* Submit Button */}
            <div className='w-full mt-2'>
              <button
                type='submit'
                disabled={isPending}
                className='cursor-pointer w-full bg-gradient-to-r from-indigo-500 to-blue-600 py-3 rounded-md text-white font-semibold text-lg hover:from-indigo-400 hover:to-blue-500 transition-all duration-300 shadow-md disabled:bg-amber-600 disabled:cursor-not-allowed'
              >
                {isPending ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ChangePasswordForm;