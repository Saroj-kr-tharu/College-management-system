import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { getAllClassesList } from '../../api/class.api';
import { getCoursesByProgramSemester } from '../../api/course.api';
import { getNextRollNumber, getNextRegistrationNumber, postStudent, updateStudent } from '../../api/student.api';
import { StudentSchema } from '../../schema/student.schema';
import { Gender, PROGRAMS, SEMESTER_OPTIONS } from '../../types/enum';
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
    const isEditing = !!student

    const methods = useForm({
        defaultValues: {
            fullName: student?.fullName || '',
            email: student?.email || '',
            phone: student?.phone || '',
            address: student?.address || '',
            dob: student?.dob ? new Date(student.dob) : new Date(),
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

    const selectedProgram = methods.watch('program')
    const selectedSemester = methods.watch('semester')

    // Auto-fetch next roll number for new students
    const { data: rollNumberData } = useQuery({
        queryFn: getNextRollNumber,
        queryKey: ['next-roll-number'],
        enabled: !isEditing,
    })

    useEffect(() => {
        if (!isEditing && rollNumberData?.data) {
            methods.setValue('rollNumber', rollNumberData.data)
        }
    }, [rollNumberData, isEditing])

    // Auto-fetch next registration number for new students
    const { data: registrationNumberData } = useQuery({
      queryFn: getNextRegistrationNumber,
      queryKey: ['next-registration-number'],
      enabled: !isEditing, // only fetch for new students
    });
    
    useEffect(() => {
      if (!isEditing && registrationNumberData?.data) {
        methods.setValue('registrationNumber', registrationNumberData.data);
      }
    }, [registrationNumberData, isEditing]);

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

    // Query for classes
    const { data: classes, isLoading: classesLoading } = useQuery({
        queryFn: getAllClassesList,
        queryKey: ['classes'],
    });

    // Add Mutation
    const { mutate, isPending } = useMutation({
        mutationFn: postStudent,
        onSuccess: (response) => {
            toast.success(response.message || 'Student Added')
            methods.reset()
            queryClient.invalidateQueries({ queryKey: ['next-roll-number'] })
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

    const onSubmit = (data: IStudentData) => {

        const { fullName, email, phone, address, dob, classes, gender, rollNumber, registrationNumber, program, semester, courses, profile } = data
        const formData = new FormData()

        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('dob', dob instanceof Date ? dob.toISOString() : dob);
        formData.append('gender', gender);
        formData.append('rollNumber', rollNumber);
        formData.append('registrationNumber', registrationNumber);
        formData.append('program', program);
        formData.append('semester', String(semester));

        if (Array.isArray(classes)) {
            classes.forEach((classId) => formData.append('classes', classId));
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

                    {/* Roll Number - Auto-generated for new students, editable for updates */}
                    {!isEditing ? (
                        <div className='flex flex-col gap-1'>
                            <div className='flex items-center gap-2'>
                                <label className='text-sm sm:text-base font-semibold text-gray-800'>
                                    Roll Number
                                </label>
                                <span className='text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full'>
                                    Auto-generated
                                </span>
                            </div>
                            <div className='w-full px-4 py-3 rounded-lg text-gray-900 text-sm sm:text-base bg-gray-50 border border-gray-300 shadow-sm font-medium'>
                                {methods.watch('rollNumber') || (
                                    <span className='text-gray-400 animate-pulse'>Generating roll number...</span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Input
                            id='rollNumber'
                            name='rollNumber'
                            label='Roll Number'
                            placeholder='Enter roll number'
                            required
                        />
                    )}

                    {/* Registration Number */}
                    {!isEditing ? (
                      <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                          <label className='text-sm sm:text-base font-semibold text-gray-800'>
                            Registration Number
                          </label>
                          <span className='text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full'>
                            Auto-generated
                          </span>
                        </div>
                    
                        <div className='w-full px-4 py-3 rounded-lg text-gray-900 text-sm sm:text-base bg-gray-50 border border-gray-300 shadow-sm font-medium'>
                          {methods.watch('registrationNumber') || (
                            <span className='text-gray-400 animate-pulse'>
                              Generating registration number...
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Input
                        id='registrationNumber'
                        name='registrationNumber'
                        label='Registration Number'
                        placeholder='Enter registration number'
                        required
                      />
                    )}

                    {/* Program Dropdown */}
                    <SelectInput
                        name='program'
                        id='program'
                        label='Program'
                        placeholder='Select program'
                        options={PROGRAMS}
                        required
                    />

                    {/* Semester Dropdown */}
                    <SelectInput
                        name='semester'
                        id='semester'
                        label='Semester'
                        placeholder='Select semester'
                        options={SEMESTER_OPTIONS}
                        required
                    />

                    {/* Auto-populated Courses Display */}
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

                    {/* Classes */}
                    <SelectInput
                        name="classes"
                        id="classes"
                        label="Classes"
                        placeholder={classesLoading ? 'Loading classes...' : 'Select classes'}
                        options={(classes?.data || []).map((c: { _id: string; name: string }) => ({
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
