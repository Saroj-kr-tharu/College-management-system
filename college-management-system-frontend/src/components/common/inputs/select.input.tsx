import { LuAsterisk } from 'react-icons/lu';
import { useController, useFormContext } from 'react-hook-form';

interface IOption {
  label: string
  value: string
}

interface IProps {
  id: string
  label: string
  name: string
  required?: boolean
  placeholder?: string
  options: IOption[]
  multiple?: boolean
}

const SelectInput: React.FC<IProps> = ({
  id,
  label,
  name,
  required = false,
  placeholder,
  options,
  multiple = false,
}) => {
  const { control, formState: { errors } } = useFormContext()
  const { field } = useController({ name, control })

  // Handle change for multiple select
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedValues = Array.from(e.target.selectedOptions).map(opt => opt.value)
      field.onChange(selectedValues)
    } else {
      field.onChange(e.target.value)
    }
  }

  return (
    <div className='w-full'>
      <div className='flex items-center gap-1 mb-1'>
        <label htmlFor={id} className='text-sm sm:text-base md:text-base text-gray-700 font-medium'>
          {label}
        </label>
        {required && <LuAsterisk size={16} className='text-red-600' />}
      </div>

      <select
        id={id}
        {...field}
        multiple={multiple}
        onChange={handleChange}
        value={field.value || (multiple ? [] : '')}
        className={`mt-1 sm:mt-2 border p-2 sm:p-3 text-sm sm:text-base rounded-md w-full 
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300
          ${errors[name] ? 'border-red-600 focus:ring-red-400' : 'border-gray-300'}`}
      >
        {!multiple && <option value='' disabled>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {errors[name] && (
        <p className='text-red-600 text-xs sm:text-sm mt-1'>
          {errors[name] ? (errors[name]?.message as string) : ''}
        </p>
      )}
    </div>
  )
}

export default SelectInput;
