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
      <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
        {/* Animated Spinner Container */}
        <div className='relative'>
          {/* Outer Glow Ring */}
          <div className='absolute inset-0 w-24 h-24 border-4 border-purple-200 rounded-full animate-ping opacity-20'></div>
          
          {/* Main Spinner */}
          <div className='relative w-20 h-20 border-4 border-t-indigo-600 border-r-purple-600 border-b-pink-600 border-l-transparent rounded-full animate-spin'></div>
          
          {/* Center Dot */}
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full animate-pulse'></div>
        </div>
        
        {/* Loading Text with Animation */}
        <div className='mt-8 text-center'>
          <p className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse mb-2'>
            Loading Dashboard
          </p>
          <p className='text-sm text-gray-600'>
            Please wait while we fetch your data...
          </p>
        </div>
        
        {/* Loading Dots Animation */}
        <div className='flex gap-2 mt-4'>
          <div className='w-3 h-3 bg-indigo-600 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
          <div className='w-3 h-3 bg-purple-600 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
          <div className='w-3 h-3 bg-pink-600 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    )
  }

  return (
    <main className='min-h-screen w-full p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
      <div className='max-w-7xl mx-auto'>
        
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 mb-6 rounded-2xl">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-blue-100">
            Manage Teachers, Students, Courses & Classes
          </p>
        </div>

        {/* Stats Cards Section */}
        <div className='mb-10'>
          <div className='flex items-center gap-2 mb-4'>
            <h3 className='text-xl font-bold text-gray-800'>Overview Statistics</h3>
          </div>
          
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
        </div>

        {/* Charts Section */}
        <div className='bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden'>
          {/* Chart Header */}
          <div className='bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-6 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Student Demographics Overview
                </h3>
                <p className="text-sm text-gray-600">
                  Visual representation of male and female students
                </p>
              </div>
            </div>
          </div>

          {/* Chart Content */}
          <div className='p-8'>
            <GenderChart students={students}/>
          </div>
        </div>

        {/* Quick Actions Footer (Optional Enhancement) */}
        <div className='mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg'>
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <div className='flex items-center gap-3'>
              <div>
                <p className='text-sm font-semibold text-gray-800'>Need help?</p>
                <p className='text-xs text-gray-600'>Check our documentation for guidance</p>
              </div>
            </div>
            <div className='text-xs text-gray-500'>
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default AdminDashboard;
