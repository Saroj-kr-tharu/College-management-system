import { HiMenu } from 'react-icons/hi';
import IconSection from './iconsection';
import { useAuth } from '../../context/auth.context';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {

  const { user } = useAuth()

  return (
    <header className='fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center justify-between px-4 md:ml-64 z-50 transition-all'>
      {/* Left section: Hamburger + Logo */}
      <div className='flex items-center'>
        {/* Mobile hamburger button */}
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className='text-gray-700 md:hidden mr-4 text-2xl'
          >
            <HiMenu />
          </button>
        )}
        <span className='text-2xl font-bold text-indigo-600'>
          CollegeMS
        </span>
      </div>

      {/* Center: Welcome Section */}
      <div className='flex-1 flex justify-center mx-4'>
        <p className="capitalize text-lg sm:text-xl font-medium bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
          Welcome Back, {(user?.role ?? 'ADMIN').toLocaleUpperCase()}
        </p>
      </div>

      {/* Right section: Logout */}
      <div className='flex items-center space-x-4'>
        <IconSection/>
      </div>
    </header>
  );
};

export default Header;
