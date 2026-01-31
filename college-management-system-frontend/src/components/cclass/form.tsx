import toast from 'react-hot-toast';
import Button from '../common/button';
import Input from '../common/inputs/input';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectInput from '../common/inputs/select.input';
import { FormProvider, useForm } from 'react-hook-form';
import { ClassSchema } from '../../schema/class.schema';
import { getAllCoursesList } from '../../api/course.api';
import { getAllStudentsList } from '../../api/student.api';
import { getAllTeachersList } from '../../api/teacher.api';
import { postClass, updateClass } from '../../api/class.api';
import type { IClassData, IClassResponse } from '../../types/class.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
            teacher: typeof classData?.teacher === 'string' 
                ? classData.teacher 
                : classData?.teacher?._id || '',
            students: classData?.students
                ? classData.students.map(student =>
                    typeof student === 'string' ? student : student._id
                  )
                : [],
            courses: classData?.courses
                ? classData.courses.map(course =>
                    typeof course === 'string' ? course : course._id
                  )
                : []
        },
        resolver: yupResolver(ClassSchema),
        mode: 'all'
    })

    // Query for teacher
    const { data: teacher, isLoading: teacherLoading } = useQuery({
        queryFn: getAllTeachersList, // your API function
        queryKey: ['teacher']
    })

    // Query for students
    const { data: students, isLoading: studentsLoading } = useQuery({
        queryFn: getAllStudentsList, // your API function
        queryKey: ['students'],
    });

    // Query for courses
    const { data: courses, isLoading: coursesLoading } = useQuery({
        queryFn: getAllCoursesList, // your API function
        queryKey: ['courses'],
    });

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
                    <Input
                        id='program'
                        name='program'
                        label='Program'
                        placeholder='Enter program'
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
                    {/* Teacher */}
                    <SelectInput
                        id='teacher'
                        name='teacher'
                        label='Teacher'
                        placeholder={teacherLoading ? 'Loading teacher...' : 'Select teacher'}
                        options={(teacher?.data || []).map((b: any) => ({
                            label: b.fullName,
                            value: b._id,
                        }))}
                        required
                    />
                    {/* Courses */}
                    <SelectInput
                        name="students"
                        id="students"
                        label="Students"
                        placeholder={studentsLoading ? 'Loading students...' : 'Select students'}
                        options={(students?.data || []).map((c: any) => ({
                            label: c.fullName,
                            value: c._id,
                        }))}
                        multiple
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

export default ClassForm;
