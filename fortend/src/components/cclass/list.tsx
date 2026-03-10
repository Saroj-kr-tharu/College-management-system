import { useState } from 'react';
import toast from 'react-hot-toast';
import Table from '../common/table/table';
import ActionButtons from '../common/table/action-button';
import { createColumnHelper } from '@tanstack/react-table';
import ConfirmationModal from '../modal/confirmation.modal';
import { deleteClass, getAllClasses } from '../../api/class.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface IProps{
  inputValue:string
}

const ClassList:React.FC<IProps> = ({inputValue}) => {

  const [page, setPage] = useState(1)
  const perPage = 5

  const [show, setShow] = useState(false)
  const [selectedClass, setselectedClass] = useState(null)

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
      queryFn: () => getAllClasses(page, perPage, {query:inputValue}),
      queryKey: ['get_all_classes', page, inputValue]
  })

  console.log({data})

  // Delete Mutation
  const { mutate, isPending } = useMutation({
      mutationFn: deleteClass,
      onSuccess: (response) => {
          toast.success(response.message ?? 'Class Deleted')
          queryClient.invalidateQueries({queryKey: ['get_all_classes']})
          setShow(false)
      },
      onError: (error) => {
          toast.error(error.message ?? 'Class could not be deleted')
      }
  })

  const onDelete = (id:string) => {
      mutate(id)
  }

  const columnHelper = createColumnHelper<any>()

  const columns = [
    columnHelper.accessor('name', {
      header: () => <span>Class Name</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('program', {
      header: () => <span>Program</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('semester', {
      header: () => <span>Semester</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('teacher.fullName', {
      header: () => <span>Teacher</span>,
      cell: (info) => <span>{ info.getValue() ?? '-' }</span>,
    }),
    columnHelper.accessor('students', {
      header: () => <span>Students</span>,
      cell: (info) => <span>{ info.getValue()?.map((student: any) => student.name || student.fullName).join(', ') || '-' }</span>,
    }),
    columnHelper.accessor('courses', {
      header: () => <span>Courses</span>,
      cell: (info) => <span>{ info.getValue()?.map((course: any) => course.name).join(', ') || '-' }</span>,
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
            edit_link={`/class/edit/${original?._id}?name=${original.name}`}
            onDelete={ () => {
              setselectedClass(original?._id)
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
        <p className='text-gray-600 animate-pulse'>Loading Classes...</p>
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
          message='Are you sure you want to remove this class?'
          confirmText='Delete'
          confirmColor='red'
          onCancel={() => setShow(false)}
          onConfirm={() => {
            onDelete(selectedClass ?? '')
          }}
        />
      }
    </>
  )
}

export default ClassList;
