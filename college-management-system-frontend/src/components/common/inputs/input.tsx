import { LuAsterisk } from 'react-icons/lu';
import { useFormContext } from 'react-hook-form';

type Props = {
  label: string,
  id: string,
  name: string,
  placeholder?: string,
  type?: 'text' | 'number' | 'password' | 'email' | 'date',
  required?: boolean
}

const Input = ({ id, label, name, placeholder='placeholder', type='text', required=false }: Props) => {

  const { register, watch, formState: { errors } } = useFormContext()

  return (
    <div className='flex flex-col gap-1'>

      {/* Label */}
      <div className='flex items-center gap-1'>
        <label
          htmlFor={id}
          className='text-sm sm:text-base font-semibold text-gray-800'
        >
          {label}
        </label>
        { required && <LuAsterisk size={16} className='text-red-600' /> }
      </div>

      {/* Input Field */}
      <input
        id={id}
        type={type}
        {...register(name)}
        value={watch(name)}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 sm:py-2 md:py-3 rounded-lg
          text-gray-900 placeholder-gray-400 text-sm sm:text-base
          bg-white border border-gray-300 shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
          transition-all duration-300
          hover:border-blue-300
          ${errors[name] 
            ? 'border-red-500 focus:ring-red-400 focus:border-red-500'
            : watch(name) 
              ? 'border-blue-400 focus:ring-blue-400' 
              : ''
          }
        `}
      />

      {/* Error Message */}
      <p className='text-red-600 text-xs sm:text-sm min-h-[18px]'>
        {errors[name as string] ? errors[name]?.message as string: ''}
      </p>

    </div>
  )
}

export default Input;
