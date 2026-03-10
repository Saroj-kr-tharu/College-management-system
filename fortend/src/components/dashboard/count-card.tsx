import React from 'react';

interface IProps {
  count: number
  label: string
  bg?: string // optional background color
}

const CountCard: React.FC<IProps> = ({ count, label, bg }) => {
  return (
    <div
      className={`rounded-2xl shadow-lg border p-6 flex flex-col gap-4 items-center justify-center 
                    text-white transform transition-all duration-300 
                    ${bg ? bg : 'bg-gradient-to-r from-indigo-400 to-indigo-600'}`}
    >
      <h1 className='text-xl sm:text-2xl font-bold'>{label}</h1>
      <span className='text-2xl sm:text-3xl font-extrabold'>{count}</span>
    </div>
  )
}

export default CountCard;
