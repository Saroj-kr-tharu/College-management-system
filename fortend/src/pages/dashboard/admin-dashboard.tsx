import { useQuery } from '@tanstack/react-query';
import { dashboard } from '../../api/dashboard.api';
import { getStudents } from '../../api/student.api';
import CountCard from '../../components/dashboard/count-card';
import GenderChart from '../../components/dashboard/GenderChart';
import type { IStudentData } from '../../types/student.types';

interface DashboardData {
  students: number
  teachers: number
  courses: number
  classes: number
}

const AdminDashboard = () => {

  const { data, isLoading } = useQuery<DashboardData>({
    queryFn: dashboard,
    queryKey: ['dashboard'],
  })

  // Fetch students for GenderChart
  const { data: students} = useQuery<IStudentData[]>({
    queryFn: getStudents,
    queryKey: ['students'],
  });

  if (isLoading) {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {/* Spinner */}
      <div className='w-10 h-10 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-3'></div>
      
      {/* Loading Text */}
      <p className='text-lg sm:text-xl font-semibold text-gray-700 animate-pulse'>
        Loading Dashboard...
      </p>
    </div>
  )
}

  return (
    <main className='h-full w-full p-6 sm:p-8 lg:p-3'>
      <h2 className='text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient'>Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <CountCard
          label='Students'
          count={data?.students || 0}
          bg='bg-gradient-to-r from-blue-400 to-blue-600 text-white'
        />
        <CountCard
          label='Teachers'
          count={data?.teachers || 0}
          bg='bg-gradient-to-r from-green-400 to-green-600 text-white'
        />
        <CountCard
          label='Courses'
          count={data?.courses || 0}
          bg='bg-gradient-to-r from-purple-400 to-purple-600 text-white'
        />
        <CountCard
          label='Classes'
          count={data?.classes || 0}
          bg='bg-gradient-to-r from-pink-400 to-pink-600 text-white'
        />
      </div>

      <div className='mt-8'>
        <GenderChart students={students}/>
      </div>
    </main>
  )
}

export default AdminDashboard;
