import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineIdcard, AiOutlineLogout, AiOutlineMail, AiOutlineUser } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import { logout } from '../api/auth.api';
import ConfirmationModal from '../components/modal/confirmation.modal';
import { useAuth } from '../context/auth.context';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
    

  // Mutation for logout
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      setUser(null)
      navigate('/login', { replace: true })
      toast.success(data.message || 'Logged Out')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Something went wrong')
    },
  })


  


  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 px-4 text-center">
        No user data found. Please log in.
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-8 rounded-3xl shadow-2xl bg-gradient-to-r from-indigo-100 to-purple-100">
        
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="w-28 h-28 md:w-32 md:h-32 bg-indigo-500 text-white rounded-full flex items-center justify-center text-4xl md:text-5xl font-bold shadow-lg">
            {getInitials(user.fullName)}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-6">
          {/* User ID */}
          <div className="flex items-center justify-between p-4 rounded-lg shadow-md bg-white">
            <div className="flex items-center gap-3">
              <AiOutlineIdcard className="text-indigo-500 text-2xl" />
              <span className="font-semibold text-gray-700">User ID:</span>
            </div>
            <span className="text-gray-600 text-base md:text-lg">{user._id}</span>
          </div>

          {/* Full Name */}
          <div className="flex items-center justify-between p-4 rounded-lg shadow-md bg-white">
            <div className="flex items-center gap-3">
              <AiOutlineUser className="text-indigo-500 text-2xl" />
              <span className="font-semibold text-gray-700">Name:</span>
            </div>
            <span className="text-gray-900 text-base md:text-lg">{user.fullName}</span>
          </div>

          {/* Role */}
          <div className="flex items-center justify-between p-4 rounded-lg shadow-md bg-white">
            <div className="flex items-center gap-3">
              <AiOutlineUser className="text-indigo-500 text-2xl" />
              <span className="font-semibold text-gray-700">Role:</span>
            </div>
            <span className="text-indigo-600 font-medium text-base md:text-lg">{user.role}</span>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-4 rounded-lg shadow-md bg-white">
            <div className="flex items-center gap-3">
              <AiOutlineMail className="text-indigo-500 text-2xl" />
              <span className="font-semibold text-gray-700">Email:</span>
            </div>
            <span className="text-gray-900 text-base md:text-lg">{user.email}</span>
          </div>
        </div>

        {/* change password */}
          <div className="mt-10 flex justify-center">
            <button
              className="flex cursor-pointer items-center gap-3 px-8 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-colors shadow-lg text-lg"
               onClick={() => navigate('/change-password') }
              disabled={isPending}
            >
              <AiOutlineLogout className="text-xl md:text-2xl" />
              <span>{isPending ? 'Processing...' : 'Change Password'}</span>
            </button>
          </div>

        {/* Logout Button */}
        <div className="mt-10 flex justify-center">
          <button
            className="flex cursor-pointer items-center gap-3 px-8 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors shadow-lg text-lg"
            onClick={() => setShow(true)}
            disabled={isPending}
          >
            <AiOutlineLogout className="text-xl md:text-2xl" />
            <span>{isPending ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Logout */}
      {show && (
        <ConfirmationModal
          title='Logout Confirmation'
          message='Are you sure you want to log out? You will need to sign in again to access your account.'
          confirmText='Logout'
          confirmColor='blue'
          onCancel={() => setShow(false)}
          onConfirm={() => {
            mutate() // Actual logout
            setShow(false)
          }}
        />
      )}

    </div>
  );
};

export default ProfilePage;
