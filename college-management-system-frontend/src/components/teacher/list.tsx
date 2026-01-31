import { useState } from 'react';
import toast from 'react-hot-toast';
import Table from '../common/table/table';
import ActionButtons from '../common/table/extra-action-button';
import { createColumnHelper } from '@tanstack/react-table';
import ConfirmationModal from '../modal/confirmation.modal';
import { deleteTeacher, getAllTeachers } from '../../api/teacher.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface IProps{
  inputValue:string
}

const TeacherList:React.FC<IProps> = ({inputValue}) => {

  const [page, setPage] = useState(1)
  const perPage = 5

  const [show, setShow] = useState(false)
  const [selectedTeacher, setselectedTeacher] = useState(null)

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
      queryFn: () => getAllTeachers(page, perPage, {query:inputValue}),
      queryKey: ['get_all_teachers', page, inputValue]
  })

  console.log({data})

  // Delete Mutation
  const { mutate, isPending } = useMutation({
      mutationFn: deleteTeacher,
      onSuccess: (response) => {
          toast.success(response.message ?? 'Teacher Deleted')
          queryClient.invalidateQueries({queryKey: ['get_all_teachers']})
          setShow(false)
      },
      onError: (error) => {
          toast.error(error.message ?? 'Teacher could not be deleted')
      }
  })

  const onDelete = (id:string) => {
      mutate(id)
  }

  const columnHelper = createColumnHelper<any>()

  const columns = [
    columnHelper.accessor('profile', {
        header: () => <span>Profile</span>,
        cell: (info) => {
            return (
                <div className='flex items-center gap-4 justify-center'>
                    <div className='h-12 w-12 flex-shrink-0'>
                        <img src={ info.row.original.profile.path }
                        className='h-full w-full object-contain rounded-md border border-gray-200 shadow-sm bg-white p-1'
                    />
                    </div>
                </div>
            )
        }
    }),
    columnHelper.accessor('fullName', {
      header: () => <span>Full Name</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: () => <span>Email</span>,
      cell: info => info.getValue(),
    }),
    // columnHelper.accessor('phone', {
    //   header: () => <span>Phone No.</span>,
    //   cell: info => info.getValue(),
    // }),
    // columnHelper.accessor('gender', {
    //   header: () => <span>Gender</span>,
    //   cell: info => info.getValue(),
    // }),
    columnHelper.accessor('department', {
      header: () => <span>Department</span>,
      cell: info => info.getValue(),
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
          view_link={`/teacher/view/${original?._id}`}
            edit_link={`/teacher/edit/${original?._id}?name=${original.fullName}`}
            onDelete={ () => {
              setselectedTeacher(original?._id)
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
        <p className='text-gray-600 animate-pulse'>Loading Teachers...</p>
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
          message='Are you sure you want to remove this teacher?'
          confirmText='Delete'
          confirmColor='red'
          onCancel={() => setShow(false)}
          onConfirm={() => {
            onDelete(selectedTeacher ?? '')
          }}
        />
      }
    </>
  )
}

export default TeacherList;
