import { useState } from 'react';
import toast from 'react-hot-toast';
import Table from '../common/table/table';
import ActionButtons from '../common/table/action-button';
import { createColumnHelper } from '@tanstack/react-table';
import ConfirmationModal from '../modal/confirmation.modal';
import { deleteCourse, getAllCourses } from '../../api/course.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface IProps{
  inputValue:string
}

const CourseList:React.FC<IProps> = ({inputValue}) => {

  const [page, setPage] = useState(1)
  const perPage = 5

  const [show, setShow] = useState(false)
  const [selectedCourse, setselectedCourse] = useState(null)

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
      queryFn: () => getAllCourses(page, perPage, {query:inputValue}),
      queryKey: ['get_all_courses', page, inputValue]
  })

  console.log({data})

  // Delete Mutation
  const { mutate, isPending } = useMutation({
      mutationFn: deleteCourse,
      onSuccess: (response) => {
          toast.success(response.message ?? 'Course Deleted')
          queryClient.invalidateQueries({queryKey: ['get_all_courses']})
          setShow(false)
      },
      onError: (error) => {
          toast.error(error.message ?? 'Course could not be deleted')
      }
  })

  const onDelete = (id:string) => {
      mutate(id)
  }

  const columnHelper = createColumnHelper<any>()

  const columns = [
    columnHelper.accessor('code', {
      header: () => <span>Code</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: () => <span>Name</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('creditHours', {
      header: () => <span>Credit Hours</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('department', {
      header: () => <span>Department</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('semester', {
      header: () => <span>Semester</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('program', {
      header: () => <span>Program</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: () => <span>Created At</span>,
      cell: info => <span>{new Intl.DateTimeFormat('en-us', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
      }).format(new Date(info.renderValue()))}</span>
    }),
    columnHelper.accessor('updatedAt', {
      header: () => <span>Updated At</span>,
      cell: info => <span>{new Intl.DateTimeFormat('en-us', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
      }).format(new Date(info.renderValue()))}</span>
    }),
    columnHelper.accessor('_', {
      header: () => <span>Actions</span>,
      footer: info => info.column.id,
      cell: ({ row: {original} }) => {
        return (
          <ActionButtons
            edit_link={`/course/edit/${original?._id}?name=${original.name}`}
            onDelete={ () => {
              setselectedCourse(original?._id)
              setShow(true)
            }}
          />
        )
      }
    }),
  ]

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-600 animate-pulse'>Loading Courses...</p>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className='flex justify-center items-center h-64 bg-white/60 rounded-xl shadow-inner'>
        <p className='text-blue-600 font-medium animate-bounce'>Please Wait...</p>
      </div>
    )
  }

  return (
    <>
      <div className='h-full w-full bg-white rounded-sm border-gray-100'>
        <div className='h-full w-full overflow-x-auto'>
          <Table
            columns={columns}
            data={data?.data}
            pagination={data?.pagination} // send pagination from backend
            onPageChange={setPage}
          />
        </div>
      </div>
      {show &&
        <ConfirmationModal
          title='Delete Confirmation'
          message='Are you sure you want to remove this course?'
          confirmText='Delete'
          confirmColor='red'
          onCancel={() => setShow(false)}
          onConfirm={() => {
            onDelete(selectedCourse ?? '')
          }}
        />
      }
    </>
  )
}

export default CourseList;
