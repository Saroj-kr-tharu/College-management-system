import { AiOutlineLock } from 'react-icons/ai';
import ChangePasswordForm from '../../components/forms/change.form';

const ChangePasswordPage = () => {
  return (
    <main className='h-full w-full p-6 sm:p-8 lg:p-10'>
      <div className='max-w-2xl mx-auto'>
        <h2 className='text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
          Change Password
        </h2>

        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-3 bg-blue-100 rounded-full'>
              <AiOutlineLock className='text-2xl text-blue-600' />
            </div>
            <div>
              <h3 className='text-xl font-semibold text-gray-800'>Update Your Password</h3>
              <p className='text-sm text-gray-500'>Enter your current password and choose a new one</p>
            </div>
          </div>

          
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  );
};

export default ChangePasswordPage;