import { useEffect, useMemo } from 'react';
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

const DEPARTMENTS = [
    { label: 'Information Technology Engineering', value: 'IT' },
    { label: 'Computer Engineering', value: 'CMP' },
    { label: 'Civil Engineering', value: 'CIVIL' },
    { label: 'Computer Science', value: 'BCA' },
];

interface IProps {
    data?: ITeacherResponse
}

const TeacherForm: React.FC<IProps> = ({ data: teacher }) => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const isEditing = !!teacher

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

    const selectedDepartment = methods.watch('department')

    // Fetch ALL courses once
    const { data: allCoursesData, isLoading: coursesLoading } = useQuery({
        queryFn: getAllCoursesList,
        queryKey: ['courses'],
    });

    // Filter courses client-side by selected department.
    // This assumes each course document has a `department` field
    // whose value matches the department option value (e.g. 'IT', 'CMP').
    const filteredCourses = useMemo(() => {
        if (!allCoursesData?.data || !selectedDepartment) return []
        return allCoursesData.data.filter(
            (c: any) => c.department === selectedDepartment
        )
    }, [allCoursesData, selectedDepartment])

    // When department changes, clear course selections so stale picks don't carry over.
    // Skip this on edit mode so existing assigned courses are preserved on first load.
    useEffect(() => {
        if (!isEditing) {
            methods.setValue('courses', [])
        }
    }, [selectedDepartment])

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

    const onSubmit = (data: ITeacherData) => {
        const { fullName, email, phone, gender, department, courses, profile } = data
        const formData = new FormData()

        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('gender', gender);
        formData.append('department', department);

        if (Array.isArray(courses)) {
            courses.forEach((courseId) => formData.append('courses', courseId));
        }

        if (profile instanceof File) {
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
                        <GenderInput />

                        {/* Department */}
                        <SelectInput
                            name='department'
                            id='department'
                            label='Department'
                            placeholder='Select department'
                            options={DEPARTMENTS}
                            required
                        />

                        {/* Courses — filtered by selected department */}
                        <div className='w-full'>
                            <div className='flex items-center gap-2 mb-1'>
                                <label className='text-sm sm:text-base text-gray-700 font-medium'>
                                    Courses
                                </label>
                                {selectedDepartment && (
                                    <span className='text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full'>
                                        Filtered by {DEPARTMENTS.find(d => d.value === selectedDepartment)?.label ?? selectedDepartment}
                                    </span>
                                )}
                            </div>

                            {/* State 1 — No department selected yet */}
                            {!selectedDepartment ? (
                                <div className='p-3 bg-gray-50 border border-gray-200 rounded-md'>
                                    <p className='text-sm text-gray-400'>
                                        Select a department first to load its courses
                                    </p>
                                </div>

                            ) : coursesLoading ? (
                                /* State 2 — Fetching all courses */
                                <div className='p-3 bg-gray-50 border border-gray-200 rounded-md'>
                                    <p className='text-sm text-gray-500 animate-pulse'>Loading courses...</p>
                                </div>

                            ) : filteredCourses.length === 0 ? (
                                /* State 3 — No courses match this department */
                                <div className='p-3 bg-gray-50 border border-gray-200 rounded-md'>
                                    <p className='text-sm text-gray-400'>
                                        No courses found for the selected department
                                    </p>
                                </div>

                            ) : (
                                /* State 4 — Multi-select with filtered courses */
                                <SelectInput
                                    name='courses'
                                    id='courses'
                                    label=''
                                    placeholder='Select courses to assign'
                                    options={filteredCourses.map((c: any) => ({
                                        label: `${c.name} (${c.code})`,
                                        value: c._id,
                                    }))}
                                    multiple
                                    required
                                />
                            )}
                        </div>

                        <ImageInput
                            id='profile'
                            name='profile'
                            label='Profile Picture'
                            required
                        />

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

export default TeacherForm;