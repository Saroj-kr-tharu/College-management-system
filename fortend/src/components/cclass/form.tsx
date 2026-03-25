import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from '../common/button';
import Input from '../common/inputs/input';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectInput from '../common/inputs/select.input';
import { FormProvider, useForm } from 'react-hook-form';
import { ClassSchema } from '../../schema/class.schema';
import { getCoursesByProgramSemester } from '../../api/course.api';
import { postClass, updateClass } from '../../api/class.api';
import type { IClassData, IClassResponse } from '../../types/class.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PROGRAMS, SEMESTER_OPTIONS } from '../../types/enum';

interface IProps {
    data?: IClassResponse
}

const ClassForm: React.FC<IProps> = ({ data: classData }) => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const methods = useForm({
        defaultValues: {
            name: classData?.name || '',
            program: classData?.program || '',
            semester: classData?.semester || 1,
            courses: classData?.courses
                ? classData.courses.map(course =>
                    typeof course === 'string' ? course : course._id
                  )
                : []
        },
        resolver: yupResolver(ClassSchema),
        mode: 'all'
    })

    const selectedProgram = methods.watch('program')
    const selectedSemester = methods.watch('semester')

    // Auto-fetch courses by program and semester
    const { data: autoCoursesData, isLoading: autoCoursesLoading } = useQuery({
        queryFn: () => getCoursesByProgramSemester(String(selectedProgram), Number(selectedSemester)),
        queryKey: ['courses-by-program-semester', selectedProgram, selectedSemester],
        enabled: !!selectedProgram && !!selectedSemester && Number(selectedSemester) > 0,
    })

    useEffect(() => {
        if (autoCoursesData?.data && autoCoursesData.data.length > 0) {
            const courseIds = autoCoursesData.data.map((c: { _id: string }) => c._id)
            methods.setValue('courses', courseIds)
        } else if (selectedProgram && selectedSemester) {
            methods.setValue('courses', [])
        }
    }, [autoCoursesData, selectedProgram, selectedSemester])

    // Add Mutation
    const { mutate, isPending } = useMutation({
        mutationFn: postClass,
        onSuccess: (response) => {
            toast.success(response.message || 'Class Added')
            methods.reset()
        },
        onError: (error) => {
            toast.error(error.message || 'Something went wrong')
        }
    })

    // Update Mutation
    const { mutate: updateMutation, isPending: updating } = useMutation({
        mutationFn: updateClass,
        onSuccess: (response) => {
            toast.success(response.message || 'Class Updated');
            queryClient.invalidateQueries({ queryKey: ['get_class_by_id', classData?._id] })
            navigate('/class')
        },
        onError: (error) => {
            toast.error(error.message || 'Something went wrong')
        }
    })

    const onSubmit = (data: IClassData) => {
        console.log('Class Form', data)
        if (classData) {
            updateMutation({ ...data, _id: classData?._id })
        } else {
            mutate(data)
        }
    };

    return (
        <div>
        {/* Hook Form Provider */}
        <FormProvider {...methods}>
            {/* @ts-expect-error //ts*/}
            <form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col gap-4'>

                <div className='flex flex-col gap-6'>

                    <Input
                        id='name'
                        name='name'
                        label='Class Name'
                        placeholder='Enter class name'
                        required
                    />
                    <SelectInput
                        name='program'
                        id='program'
                        label='Program'
                        placeholder='Select program'
                        options={PROGRAMS}
                        required
                    />
                    <SelectInput
                        name='semester'
                        id='semester'
                        label='Semester'
                        placeholder='Select semester'
                        options={SEMESTER_OPTIONS}
                        required
                    />
                    {/* Courses - Auto-assigned by program & semester */}
                    <div className='w-full'>
                        <div className='flex items-center gap-2 mb-1'>
                            <label className='text-sm sm:text-base md:text-base text-gray-700 font-medium'>
                                Courses
                            </label>
                            <span className='text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full'>
                                Auto-assigned
                            </span>
                        </div>
                        {autoCoursesLoading ? (
                            <div className='p-3 bg-gray-50 border border-gray-200 rounded-md'>
                                <p className='text-sm text-gray-500 animate-pulse'>Loading courses...</p>
                            </div>
                        ) : autoCoursesData?.data && autoCoursesData.data.length > 0 ? (
                            <div className='flex flex-wrap gap-2 p-3 bg-blue-50/50 border border-blue-200 rounded-md'>
                                {autoCoursesData.data.map((c: { _id: string; name: string; code: string }) => (
                                    <span key={c._id} className='px-3 py-1.5 bg-white text-blue-700 rounded-lg text-sm font-medium shadow-sm border border-blue-100'>
                                        {c.name} ({c.code})
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className='p-3 bg-gray-50 border border-gray-200 rounded-md'>
                                <p className='text-sm text-gray-400'>
                                    {selectedProgram && Number(selectedSemester) > 0
                                        ? 'No courses found for selected program and semester'
                                        : 'Select program and semester to auto-assign courses'}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
                <div>
                    <Button
                        label={isPending || updating ? 'Submitting...' : 'Submit'}
                        type='submit'
                        isPending={isPending || updating}
                    />
                </div>

            </form>
        </FormProvider>

    </div>
    )
}

export default ClassForm;