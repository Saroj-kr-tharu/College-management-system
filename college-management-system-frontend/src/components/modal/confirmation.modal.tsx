import type React from 'react';
import { IoClose } from 'react-icons/io5';

interface IProps {
    title: string
    message: string
    confirmText: string
    confirmColor?: 'red' | 'blue' | 'green' | 'gray' // extend if needed
    onConfirm: () => void
    onCancel: () => void
}

const ConfirmationModal: React.FC<IProps> = ({
    title,
    message,
    confirmText,
    confirmColor = 'blue',
    onCancel,
    onConfirm,
}) => {
    // Tailwind classes for button colors
    const confirmBtnClasses: Record<string, string> = {
        red: 'bg-red-600 hover:bg-red-700 focus:ring-red-400',
        blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400',
        green: 'bg-green-600 hover:bg-green-700 focus:ring-green-400',
        gray: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-400',
    }   
    return (
        <div
          onClick={onCancel}
          className='fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50'
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='relative bg-white w-full max-w-md rounded-xl p-8 shadow-2xl border border-gray-100 transition-all animate-slideUp'
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer'
              aria-label='Close'
            >
              <IoClose size={26} />
            </button> 
            {/* Content */}
            <div className='text-center'>
              <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
              <p className='mt-3 text-gray-600 text-sm leading-relaxed'>{message}</p>
            </div>    
            {/* Actions */}
            <div className='mt-8 flex justify-center gap-4'>
              <button
                onClick={onCancel}
                className='cursor-pointer px-6 py-2.5 rounded-lg text-gray-700 text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors transform hover:scale-105 active:scale-95'
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`cursor-pointer px-6 py-2.5 rounded-lg text-white text-sm font-medium shadow-md focus:ring-2 transition-colors transform hover:scale-105 active:scale-95 ${confirmBtnClasses[confirmColor]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
    )
}

export default ConfirmationModal;
