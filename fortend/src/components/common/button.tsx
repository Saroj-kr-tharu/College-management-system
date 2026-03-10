import React from 'react';

interface IProps {
    isPending: boolean
    label: string
    type: 'submit' | 'button'
}

const Button: React.FC<IProps> = ({ isPending, label, type='button' }) => {
  return (
    <div className='flex justify-center mt-4'>
        <button
            type={type}
            disabled={isPending}
            className='flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all text-white font-medium rounded-sm shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
        >
            {label}
        </button>
    </div>
  )
}

export default Button;
