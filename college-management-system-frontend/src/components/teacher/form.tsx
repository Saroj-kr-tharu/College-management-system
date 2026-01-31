import toast from 'react-hot-toast';
import Button from '../common/button';
import { Gender } from '../../types/enum';
import Input from '../common/inputs/input';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import ImageInput from '../common/inputs/image.input';
import GenderInput from '../common/inputs/gender.input';
import SelectInput from '../common/inputs/select.input';
import { FormProvider, useForm } from 'react-hook-form';
import { getAllCoursesList } from '../../api/course.api';
import { TeacherSchema } from '../../schema/teacher.schema';
import { postTeacher, updateTeacher } from '../../api/teacher.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ITeacherData, ITeacherResponse } from '../../types/teacher.types';

interface IProps {
    data?: ITeacherResponse
}

const TeacherForm: React.FC<IProps> = ({ data: teacher }) => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const methods = useForm({
        defaultValues: {
            fullName: teacher?.fullName || '',
            email: teacher?.email || '',
            phone: teacher?.phone || '',
            gender: teacher?.gender || Gender.OTHER,
            department: teacher?.department || '',
            courses: teacher?.courses
                ? teacher.courses.map(course =>
                    typeof course === 'string' ? course : course._id
                  )
                : [],
            profile: '',
        },
        resolver: yupResolver(TeacherSchema),
        mode: 'all'
    })

    // Query for courses
    const { data: courses, isLoading: coursesLoading } = useQuery({
        queryFn: getAllCoursesList, // your API function
        queryKey: ['courses'],
    });

    // Add Mutation
    const { mutate, isPending } = useMutation({
        mutationFn: postTeacher,
        onSuccess: (response) => {
            toast.success(response.message || 'Teacher Added')
            methods.reset()
        },
        onError: (error) => {
            toast.error(error.message || 'Something went wrong')
        }
    })

    // Update Mutation
    const { mutate: updateMutation, isPending: updating } = useMutation({
        mutationFn: updateTeacher,
        onSuccess: (response) => {
            toast.success(response.message || 'Teacher Updated');
            queryClient.invalidateQueries({ queryKey: ['get_teacher_by_id', teacher?._id] })
            navigate('/teacher')
        },
        onError: (error) => {
            toast.error(error.message || 'Something went wrong')
        }
    })

    console.log(methods.formState.errors)

    const onSubmit = (data: ITeacherData) => {

        const { fullName, email, phone, gender, department, courses, profile } = data
        const formData = new FormData()

        console.log('Teacher Form', data)

        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('gender', gender); // enum/string
        formData.append('department', department);

        if (Array.isArray(courses)) {
            courses.forEach((courseId) => formData.append('courses', courseId));
        }

        if(profile instanceof File) {
            formData.append('profile', profile)
        }

        if (teacher) {
            updateMutation({ formData, _id: teacher?._id })
        } else {
            mutate(formData)
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
                        id='fullName'
                        name='fullName'
                        label='Full Name'
                        placeholder='Enter full name'
                        required
                    />
                    <Input
                        id='email'
                        name='email'
                        label='Email'
                        type='email'
                        placeholder='Enter email'
                        required
                    />
                    <Input
                        id='phone'
                        name='phone'
                        label='Phone Number'
                        type='number'
                        placeholder='Enter phone number'
                        required
                    />
                    <GenderInput/>
                    <Input
                        id='department'
                        name='department'
                        label='Department'
                        placeholder='Enter department'
                        required
                    />
                    {/* Courses */}
                    <SelectInput
                        name="courses"
                        id="courses"
                        label="Courses"
                        placeholder={coursesLoading ? 'Loading courses...' : 'Select courses'}
                        options={(courses?.data || []).map((c: any) => ({
                            label: c.name,
                            value: c._id,
                        }))}
                        multiple
                        required
                    />
                    <ImageInput
                        id='profile'
                        name='profile'
                        label='Profile Picture'
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

export default TeacherForm;
