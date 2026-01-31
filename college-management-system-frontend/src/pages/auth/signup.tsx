import { Link } from 'react-router';
import SignupForm from '../../components/forms/signup.form';

const Signup = () => {
  return (
    <main
      className='min-h-screen w-full flex justify-center items-center 
                  bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 
                  px-4 pt-8 pb-8'
    >
      <div
        className='w-full max-w-md bg-white/90 backdrop-blur-sm 
                    rounded-2xl shadow-2xl p-8'
      >
        {/* Heading */}
        <h1 className='text-4xl font-extrabold text-gray-900 text-center mb-6'>
          Create Account
        </h1>
        <p className='text-center text-gray-600 mb-8'>
          Sign up to get started with your account
        </p>

        {/* Signup Form */}
        <SignupForm />

        {/* Divider */}
        <div className='my-6 flex items-center'>
          <hr className='flex-grow border-gray-300' />
          <span className='px-3 text-gray-500 text-sm'>OR</span>
          <hr className='flex-grow border-gray-300' />
        </div>

        {/* Link To Login */}
        <p className='text-center text-gray-700'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='text-violet-700 font-semibold hover:underline'
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;
