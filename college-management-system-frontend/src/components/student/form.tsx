import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { getAllClassesList } from '../../api/class.api';
import { getAllCoursesList } from '../../api/course.api';
import { postStudent, updateStudent } from '../../api/student.api';
import { StudentSchema } from '../../schema/student.schema';
import { Gender } from '../../types/enum';
import type { IStudentData, IStudentResponse } from '../../types/student.types';
import Button from '../common/button';
import GenderInput from '../common/inputs/gender.input';
import ImageInput from '../common/inputs/image.input';
import Input from '../common/inputs/input';
import SelectInput from '../common/inputs/select.input';

interface IProps {
    data?: IStudentResponse
}

const StudentForm: React.FC<IProps> = ({ data: student }) => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const methods = useForm({
        defaultValues: {
            fullName: student?.fullName || '',
            email: student?.email || '',
            phone: student?.phone || '',
            address: student?.address || '',
            dob: student?.dob ? new Date(student.dob) : new Date(), // fallback to today's date
            gender: student?.gender || Gender.OTHER,
            rollNumber: student?.rollNumber || '',
            registrationNumber: student?.registrationNumber || '',
            program: student?.program || '',
            semester: student?.semester || 1,
            courses: student?.courses
                ? student.courses.map(course =>
                    typeof course === 'string' ? course : course._id
                  )
                : [],
            classes: student?.classes
            ? student.classes.map(cls =>
                typeof cls === 'string' ? cls : cls._id
              )
            : [],
            profile: '',
        },
        resolver: yupResolver(StudentSchema),
        mode: 'all'
    })

    // Query for courses
    const { data: courses, isLoading: coursesLoading } = useQuery({
        queryFn: getAllCoursesList, // your API function
        queryKey: ['courses'],
    });

    const { data: classes, isLoading: classesLoading } = useQuery({
        queryFn: getAllClassesList, // your API function
        queryKey: ['classes'],
    });

    // Add Mutation
    const { mutate, isPending } = useMutation({
        mutationFn: postStudent,
        onSuccess: (response) => {
            toast.success(response.message || 'Student Added')
            methods.reset()
        },
        onError: (error) => {
            toast.error(error.message || 'Something went wrong')
        }
    })

    // Update Mutation
    const { mutate: updateMutation, isPending: updating } = useMutation({
        mutationFn: updateStudent,
        onSuccess: (response) => {
            toast.success(response.message || 'Student Updated');
            queryClient.invalidateQueries({ queryKey: ['get_student_by_id', student?._id] })
            navigate('/student')
        },
        onError: (error) => {
            toast.error(error.message || 'Something went wrong')
        }
    })

    console.log(methods.formState.errors)

    const onSubmit = (data: IStudentData) => {

        const { fullName, email, phone, address, dob,classes, gender, rollNumber, registrationNumber, program, semester, courses, profile } = data
        const formData = new FormData()

        console.log('Student Form', data)

        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('dob', dob instanceof Date ? dob.toISOString() : dob);
        formData.append('gender', gender); // enum/string
        formData.append('rollNumber', rollNumber);
        formData.append('registrationNumber', registrationNumber);
        formData.append('program', program);
        formData.append('semester', String(semester));

        if (Array.isArray(classes)) {
            classes.forEach((courseId) => formData.append('classes', courseId));
        }

        if (Array.isArray(courses)) {
            courses.forEach((courseId) => formData.append('courses', courseId));
        }

        if(profile instanceof File) {
            formData.append('profile', profile)
        }

        if (student) {
            updateMutation({ formData, _id: student?._id })
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
                    <Input
                        id='address'
                        name='address'
                        label='Address'
                        placeholder='Enter address'
                        required
                    />
                    <Input
                        id='dob'
                        name='dob'
                        label='Date of Birth'
                        type='date'
                        required
                    />
                    <GenderInput/>
                    <Input
                        id='rollNumber'
                        name='rollNumber'
                        label='Roll Number'
                        placeholder='Enter roll number'
                        required
                    />
                    <Input
                        id='registrationNumber'
                        name='registrationNumber'
                        label='Registration Number'
                        placeholder='Enter registration number'
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

                    <SelectInput
                        name="classes"
                        id="classes"
                        label="classes"
                        placeholder={classesLoading ? 'Loading classes...' : 'Select classes'}
                        options={(classes?.data || []).map((c: any) => ({
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

export default StudentForm;
