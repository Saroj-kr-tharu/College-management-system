// import toast from 'react-hot-toast';
// import Button from '../common/button';
// import Input from '../common/inputs/input';
// import { useNavigate } from 'react-router';
// import { AttendanceStatus } from '../../types/enum';
// import { yupResolver } from '@hookform/resolvers/yup';
// import SelectInput from '../common/inputs/select.input';
// import { FormProvider, useForm } from 'react-hook-form';
// import { getAllCoursesList } from '../../api/course.api';
// import { getAllClassesList } from './../../api/class.api';
// import { getAllStudentsList } from '../../api/student.api';
// import { AttendanceSchema } from '../../schema/attendance.schema';
// import { postAttendance, updateAttendance } from '../../api/attendance.api';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import type { IAttendanceData, IAttendanceResponse } from '../../types/attendance.types';

// interface IProps {
//     data?: IAttendanceResponse
// }

// const AttendanceForm: React.FC<IProps> = ({ data: attendance }) => {

//     const queryClient = useQueryClient()
//     const navigate = useNavigate()

//     // Form setup
//     const methods = useForm<any>({
//       defaultValues: {
//         student: attendance?.student?._id || '',
//         class: attendance?.class?._id || '',
//         course: attendance?.course?._id || '',
//         date: attendance?.date
//           ? new Date(attendance.date).toISOString().split('T')[0]
//           : '',
//         status: attendance?.status || AttendanceStatus.PRESENT,
//         remarks: attendance?.remarks || '',
//       },
//       resolver: yupResolver(AttendanceSchema),
//       mode: 'all'
//     });

//     const { handleSubmit, reset } = methods;

//     // Fetch dropdown data
//     const { data: studentsData } = useQuery({
//         queryFn: getAllStudentsList,
//         queryKey: ['students']
//     });
//     const { data: classesData } = useQuery({
//         queryFn: getAllClassesList,
//         queryKey: ['classes']
//     });
//     const { data: coursesData } = useQuery({
//         queryFn: getAllCoursesList,
//         queryKey: ['courses']
//     });

//     const students = studentsData?.data || [];
//     const classes = classesData?.data || [];
//     const courses = coursesData?.data || [];

//     // Add Mutation
//     const { mutate, isPending } = useMutation({
//       mutationFn: postAttendance,
//       onSuccess: (response) => {
//         toast.success(response.message || 'Attendance Added')
//         reset()
//       },
//       onError: (error: any) =>
//         toast.error(error.message || 'Failed to add attendance')
//     })

//     // Update Mutation
//     const { mutate: updateMutation, isPending: updating } = useMutation({
//       mutationFn: updateAttendance,
//       onSuccess: (response) => {
//         toast.success(response.message || 'Attendance Updated')
//         queryClient.invalidateQueries({ queryKey: ['get_attendance_by_id', attendance?._id] })
//         navigate('/attendance')
//       },
//       onError: (error) =>
//         toast.error(error.message || 'Failed to update attendance')
//     })

//     // Submit handler
//     const onSubmit = (data: IAttendanceData) => {
//         if (attendance) {
//             updateMutation({ ...data, _id: attendance?._id })
//         } else {
//             mutate(data)
//         }
//     }

//     return (
//         <div>
//             {/* Hook Form Provider */}
//             <FormProvider {...methods}>
//                 <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>

//                     <div className='flex flex-col gap-6'>

//                     {/* Student */}
//                     <SelectInput
//                         id='student'
//                         name='student'
//                         label='Student'
//                         required
//                         options={students.map((s: any) => ({ value: s._id, label: s.fullName }))}
//                     />

//                     {/* Class */}
//                     <SelectInput
//                         id='class'
//                         name='class'
//                         label='Class'
//                         required
//                         options={classes.map((c: any) => ({ value: c._id, label: c.name })) || []}
//                     />

//                     {/* Course */}
//                     <SelectInput
//                         id='course'
//                         name='course'
//                         label='Course'
//                         required
//                         options={courses.map((c: any) => ({ value: c._id, label: c.name })) || []}
//                     />

//                     {/* Date */}
//                     <Input
//                         id='date'
//                         name='date'
//                         label='Date'
//                         type='date'
//                         required
//                     />

//                     {/* Status */}
//                     <SelectInput
//                         id='status'
//                         name='status'
//                         label='Status'
//                         required
//                         options={Object.values(AttendanceStatus).map(s => ({ value: s, label: s }))}
//                     />

//                     {/* Remarks */}
//                     <Input
//                         id='remarks'
//                         name='remarks'
//                         label='Remarks'
//                         placeholder='Add remarks (optional)'
//                     />

//                     </div>

//                     {/* Buttons */}
//                     <div>
//                         <Button
//                             label= {isPending || updating ? 'Submitting...' : 'Submit'}
//                             type= 'submit'
//                             isPending={isPending || updating}
//                         />
//                     </div>

//                 </form>
//             </FormProvider>
//         </div>
//     );
// };

// export default AttendanceForm;
