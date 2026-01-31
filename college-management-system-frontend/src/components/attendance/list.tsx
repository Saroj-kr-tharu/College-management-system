// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import Table from '../common/table/extra-table';
// import ActionButtons from '../common/table/action-button';
// import { createColumnHelper } from '@tanstack/react-table';
// import ConfirmationModal from '../modal/confirmation.modal';
// import { deleteAttendance, getAllAttendance } from '../../api/attendance.api';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// const AttendanceList = () => {

//   const [page, setPage] = useState(1)
//   const perPage = 5

//   const [showForm, setShowForm] = useState(false)
//   const [selectedRecord, setSelectedRecord] = useState(null)
  
//   const queryClient = useQueryClient()

//   // Fetch all attendance records
//   const { data, isLoading } = useQuery({
//       queryFn: () => {return getAllAttendance(page, perPage)},
//       queryKey: ['get_all_attendance', page]
//   })

//   // Delete attendance mutation
//   const { mutate, isPending } = useMutation({
//       mutationFn: deleteAttendance,
//       onSuccess: (response) => {
//           toast.success(response?.message ?? 'Attendance Deleted')
//           queryClient.invalidateQueries({ queryKey: ['get_all_attendances'] })
//           setShowForm(false)
//       },
//       onError: (error) => {
//           toast.error(error.message ?? 'Failed to delete attendance')
//       },
//   });
//   const onDelete = (id:string) => {
//       mutate(id)
//   }
//   // Table columns
//   const columnHelper = createColumnHelper<any>()
// const columns = [
//   columnHelper.accessor(row => row.student?.fullName, { id: 'student', header: 'Student' }),
//   columnHelper.accessor(row => row.class?.name, { id: 'class', header: 'Class' }),
//   columnHelper.accessor(row => row.course?.name, { id: 'course', header: 'Course' }),
//   columnHelper.accessor(row => new Date(row.date).toLocaleDateString(), { id: 'date', header: 'Date' }),
  
//   // Status column with dropdown
//   columnHelper.accessor(row => row.status, {
//     id: 'status',
//     header: 'Status',
//     cell: ({ row: { original }, getValue }) => {
//       const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         // Optional: call a function to update status in state or API
//         const newStatus = e.target.value
//         console.log(`Update status for ${original._id}:`, newStatus)
//         // Example: updateStateOrAPI(original._id, newStatus)
//       }

//       return (
//         <select
//           defaultValue={getValue()}
//           onChange={handleChange}
//           className="px-2 py-1 border border-gray-300 rounded text-sm"
//         >
//           <option value="PRESENT">PRESENT</option>
//           <option value="ABSENT">ABSENT</option>
//           <option value="LEAVE">LEAVE</option> {/* optional extra status */}
//         </select>
//       )
//     }
//   }),

//   columnHelper.accessor(row => row.remarks || '-', { id: 'remarks', header: 'Remarks' }),
//   columnHelper.accessor('_', {
//     header: () => <span>Actions</span>,
//     footer: info => info.column.id,
//     cell: ({ row: { original } }) => {
//       return (
//         <ActionButtons
//           edit_link={`/attendance/edit/${original?._id}`}
//           onDelete={() => {
//             setSelectedRecord(original?._id)
//             setShowForm(true)
//           }}
//         />
//       )
//     }
//   }),
// ]

//   // Loading and Pending states
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-gray-600 animate-pulse">Loading Attendance...</p>
//       </div>
//     );
//   }
//   if (isPending) {
//     return (
//       <div className="flex justify-center items-center h-64 bg-white/60 rounded-xl shadow-inner">
//         <p className="text-blue-600 font-medium animate-bounce">Please Wait...</p>
//       </div>
//     );
//   }
//   return (
//     <>
//       <div className='h-full w-full bg-white rounded-sm border-gray-100'>
//           <div className='h-full w-full overflow-x-auto'>
//               <Table
//                 columns={columns}
//                 data={data?.data}
//                 pagination={data?.pagination} // send pagination from backend
//                 onPageChange={setPage}
//               />
//           </div>
//       </div>
//       {/* Delete Confirmation Modal */}
//       {showForm && (
//         <ConfirmationModal
//           title="Delete Attendance"
//           message="Are you sure you want to delete this attendance record?"
//           confirmText="Delete"
//           confirmColor="red"
//           onCancel={() => setShowForm(false)}
//           onConfirm={() => {
//               onDelete(selectedRecord ?? '')
//           }}
//         />
//       )}
//     </>
//   )
// }

// export default AttendanceList;
