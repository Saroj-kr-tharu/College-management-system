import { LuAsterisk } from 'react-icons/lu';
import { useFormContext } from 'react-hook-form';

const GenderInput = () => {
  const { register, watch, formState: { errors } } = useFormContext();

  return (
    <div className='flex flex-col gap-2'>

      {/* Field */}
      <div className='flex items-center gap-1'>
        <label
          htmlFor='gender'
          className='text-sm sm:text-base font-medium text-gray-700'
        >
          Gender
        </label>
        <LuAsterisk size={16} className='text-red-600' />
      </div>

      {/* Select Field */}
      <select
        id='gender'
        {...register('gender')}
        value={watch('gender')}
        className={`
          w-full px-4 py-3 sm:py-2 md:py-3 rounded-md
          bg-white text-gray-800 text-sm sm:text-base
          placeholder-gray-400 border focus:outline-none transition-all duration-300
          ${errors.gender ? 'border-red-600 focus:border-red-600' : 'border-gray-300 focus:border-indigo-500'}
        `}
      >
        <option value='MALE'>MALE</option>
        <option value='FEMALE'>FEMALE</option>
        <option value='OTHER'>OTHER</option>
      </select>

      {/* Error Message */}
      <p className='text-red-600 text-xs sm:text-sm min-h-[18px] -mt-1'>
        {errors.gender?.message as string || ''}
      </p>

    </div>
  );
};

export default GenderInput;
