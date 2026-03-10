import React from 'react';
import { Link } from 'react-router';
import { IoIosAdd } from 'react-icons/io';

interface IProps {
  title: string;
  sub_title?: string;
  button_text?: string;
  link_to?: string;
}

const PageHeader: React.FC<IProps> = ({ title, sub_title, button_text, link_to }) => {
  return (
    <div className='w-full mx-auto flex justify-between items-center bg-white shadow-sm rectangle p-4 md:p-6'>
      
      {/* Left: Title & Subtitle */}
      <div className='flex flex-col text-left'>
        <h1 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text'>
            {title}
        </h1>

        {sub_title && (
          <p className='text-gray-600 text-sm sm:text-base mt-1'>
            {sub_title}
          </p>
        )}
      </div>

      {/* Right: Button */}
      {button_text && link_to && (
        <Link
          to={link_to}
          className='flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all text-white font-medium rounded-sm shadow-md ml-4'
        >
          <IoIosAdd size={20} />
          <span className='text-sm sm:text-base'>{button_text}</span>
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
