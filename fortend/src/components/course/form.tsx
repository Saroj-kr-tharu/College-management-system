import toast from 'react-hot-toast';
import Button from '../common/button';
import Input from '../common/inputs/input';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { CourseSchema } from '../../schema/course.schema';
import { postCourse, updateCourse } from '../../api/course.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ICourseData, ICourseResponse } from '../../types/course.types';

interface IProps {
    data?: ICourseResponse
}

const CourseForm: React.FC<IProps> = ({ data: course }) => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const methods = useForm({
        defaultValues: {
            code: course?.code || '',
            name: course?.name || '',
            creditHours: course?.creditHours || 1,
            department: course?.department || '',
            semester: course?.semester || 1,
            program: course?.program || ''
        },
        resolver: yupResolver(CourseSchema),
        mode: 'all'
    })

    // Add Mutation
    const { mutate, isPending } = useMutation({
        mutationFn: postCourse,
        onSuccess: (response) => {
            toast.success(response.message || 'Course Added')
            methods.reset()
        },
        onError: (error) => {
            toast.error(error.message || 'Something went wrong')
        }
    })

    // Update Mutation
    const { mutate: updateMutation, isPending: updating } = useMutation({
        mutationFn: updateCourse,
        onSuccess: (response) => {
            toast.success(response.message || 'Course Updated');
            queryClient.invalidateQueries({ queryKey: ['get_course_by_id', course?._id] })
            navigate('/course')
        },
        onError: (error) => {
            toast.error(error.message || 'Something went wrong')
        }
    })

    const onSubmit = (data: ICourseData) => {
        console.log('Course Form', data)
        if (course) {
            updateMutation({ ...data, _id: course?._id })
        } else {
            mutate(data)
        }
    };

    return (
        <div>
        {/* Hook Form Provider */}
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col gap-4'>

                <div className='flex flex-col gap-6'>
                    
                    <Input
                        id='code'
                        name='code'
                        label='Course Code'
                        placeholder='Enter course code'
                        required
                    />
                    <Input
                        id='name'
                        name='name'
                        label='Course Name'
                        placeholder='Enter course name'
                        required
                    />
                    <Input
                        id='creditHours'
                        name='creditHours'
                        label='Credit Hours'
                        type='number'
                        placeholder='Enter credit hours'
                        required
                    />
                    <Input
                        id='department'
                        name='department'
                        label='Department'
                        placeholder='Enter department'
                        required
                    />
                    <Input
                        id='semester'
                        name='semester'
                        label='Semester'
                        type='number'
                        placeholder='Enter semester'
                        required
                    />
                    <Input
                        id='program'
                        name='program'
                        label='Program'
                        placeholder='Enter program'
                        required
                    />

                </div>
                <div>
                    <Button
                        label= {isPending || updating ? 'Submitting...' : 'Submit'}
                        type= 'submit'
                        isPending={isPending || updating}
                    />
                </div>

            </form>
        </FormProvider>

    </div>
    )
}

export default CourseForm;
