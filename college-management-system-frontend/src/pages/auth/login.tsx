import { Link } from 'react-router';
import LoginForm from '../../components/forms/login.form';

const Login = () => {
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
        {/* Heading */}
        <h1 className='text-4xl font-extrabold text-gray-900 text-center mb-6'>
          Welcome Back
        </h1>
        <p className='text-center text-gray-600 mb-8'>
          Log in to continue to your account
        </p>

        {/* LogIn Form */}
        <LoginForm />

        {/* Divider */}
        <div className='my-6 flex items-center'>
          <hr className='flex-grow border-gray-300' />
          <span className='px-3 text-gray-500 text-sm'>OR</span>
          <hr className='flex-grow border-gray-300' />
        </div>

        {/* Link To Signup */}
        <p className='text-center text-gray-700'>
          Don&apos;t have an account?{' '}
          <Link
            to='/signup'
            className='text-violet-700 font-semibold hover:underline'
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
