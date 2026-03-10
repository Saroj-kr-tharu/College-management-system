import { useRef } from 'react';
import { LuAsterisk } from 'react-icons/lu';
import { useController, useFormContext } from 'react-hook-form';

interface IProps {
    id: string
    label: string
    required?: boolean
    placeholder?: string
    name: string
    multiple?: boolean
}

const ImageInput: React.FC<IProps> = ({
    label,
    id,
    required = false,
    multiple = false,
    placeholder = 'Click to upload image',
    name
}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { control, formState: { errors } } = useFormContext()
    const { field: { onChange, value } } = useController({ name, control })

    const onImageChange = (file: FileList | null) => {
        if (!file) return
        const images = Array.from(file)
        if (multiple) {
            onChange(images)
        } else {
            onChange(images[0])
        }
    }

    return (
        <div className='w-full'>
            {/* Label */}
            <div className='flex items-center gap-1 mb-2'>
                <label htmlFor={id} className='text-sm text-gray-700 font-medium'>
                    {label}
                </label>
                {required && <LuAsterisk size={15} className='text-red-600' />}
            </div>

            {/* Input */}
            <div
                onClick={() => inputRef.current?.click()}
                className={`
                    cursor-pointer 
                    border-2 border-dashed rounded-lg 
                    ${errors[name as string] ? 'border-red-600' : 'border-blue-600'} 
                    flex flex-col items-center justify-center 
                    p-4 
                    min-h-[100px] sm:min-h-[100px] md:min-h-[100px] 
                    transition-colors duration-300 hover:bg-violet-50
                `}
            >
                <input
                    ref={inputRef}
                    id={id}
                    type='file'
                    className='hidden'
                    onChange={(e) => onImageChange(e.target.files)}
                    multiple={multiple}
                />
                <p className='text-gray-500 text-sm sm:text-base text-center'>{placeholder}</p>
                {errors[name as string] && (
                    <p className='text-red-600 text-xs mt-1'>{errors[name]?.message as string}</p>
                )}
            </div>

            {/* Preview */}
            {value && (
                <div className='mt-4 flex flex-wrap gap-4 justify-center'>
                    {multiple
                        ? value.map((img: File, idx: number) => (
                            <img
                                key={idx}
                                src={URL.createObjectURL(img)}
                                alt='Preview'
                                className='h-25 w-25 border border-gray-300 rounded-lg object-cover'
                            />
                        ))
                        : (
                            <img
                                src={URL.createObjectURL(value)}
                                alt='Preview'
                                className='h-25 w-25 border border-gray-300 rounded-lg object-cover'
                            />
                        )}
                </div>
            )}
        </div>
    )
}

export default ImageInput;
