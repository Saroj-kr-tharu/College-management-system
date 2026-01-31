import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { IoMdLogIn } from 'react-icons/io';
import { logout } from '../../api/auth.api';
import type { IUser } from '../../types/auth.types';
import { useMutation } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/auth.context';
import { IoPersonCircleOutline } from 'react-icons/io5';
import ConfirmationModal from '../modal/confirmation.modal';
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';

const IconSection = () => {

  const { user, setUser } = useAuth()
  const navigate = useNavigate();

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Logout modal state
  const [show, setShow] = useState(false)

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

  const get_user_full_name = (user: IUser | null) => {
    return `${user?.fullName ?? ''}`.trim()
  };

  const goToProfile = () => {
    navigate('/profile'); // Navigate to profile page
    setDropdownOpen(false); // close dropdown after click
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative flex gap-5 items-center'>
      {!user ? (
        <div
          className='flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full 
                      bg-gradient-to-r from-indigo-500 to-purple-500 
                      text-white font-semibold shadow-lg 
                      hover:from-purple-500 hover:to-indigo-500 
                      transform hover:scale-105 transition-all duration-300'
          onClick={() => navigate('/login')}
        >
          <IoMdLogIn size={22} />
          <span>Login</span>
        </div>
      ) : (
        <div className='relative' ref={dropdownRef}>
          {/* Circle Icon */}
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer
                        transition-all duration-200 transform
                        ${dropdownOpen ? 'scale-95' : 'hover:scale-105'}`}
          >
            <IoPersonCircleOutline size={40} className='text-indigo-500' />
          </div>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50
                        transform transition-all duration-300 origin-top-right
                        ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
          >
            {/* Arrow */}
            <div className='absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200'></div>

            {/* User Name + Role */}
            <div className='px-4 py-3 border-b border-gray-100'>
              {user && (
                <p className='font-semibold'>
                  <span className='text-black'>{get_user_full_name(user)}</span>{' '}
                  <span className='text-indigo-900'>{user.role}</span>
                </p>
              )}
            </div>

            {/* Menu Buttons */}
            <div className='flex flex-col'>
              <button
                className='flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 transition-colors cursor-pointer'
                onClick={goToProfile} // Navigate to profile
              >
                <AiOutlineUser className='text-indigo-500' />
                <span>My Profile</span>
              </button>
              <button
                className='flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 transition-colors cursor-pointer'
                onClick={() => setShow(true)}
                disabled={isPending}
              >
                <AiOutlineLogout className='text-red-500' />
                <span>{isPending ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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

export default IconSection;
