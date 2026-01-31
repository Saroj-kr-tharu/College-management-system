import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentById } from '../../api/student.api';
import StudentForm from '../../components/student/form';
import { useParams, useSearchParams } from 'react-router';
import PageHeader from '../../components/header/page-header';

const UpdateStudent = () => {

  const [showLoader, setShowLoader] = useState(true);

  const { id } = useParams()
  const search = useSearchParams()
  console.log(id, search[0].get('name'))

  const { isLoading, data } = useQuery({
      queryFn: () => { return getStudentById(id || '') },
      queryKey: ['get_student_by_id', id]
  })

  // Ensure loader shows at least 1.5 seconds
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1500); // minimum 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading || showLoader) {
    return (
      <div className='flex justify-center items-center h-64 sm:h-80 md:h-96 w-full'>
        <div className='flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-6 sm:p-8'>
          <div className='w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4'></div>
          <p className='text-gray-700 text-sm sm:text-base font-medium'>
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  console.log(isLoading, data?.data)

  return (
    <main className='min-h-screen w-full p-0'>
      
      {/* Page Header */}
      <PageHeader
        key='update-student'
        title='Update Student'
        sub_title='All Students'
        button_text='View List'
        link_to='/student'
      />

      {/* Main content */}
      <div className='mx-auto w-full sm:px-0 lg:px-0 mt-6 md:mt-6'>
        
        {/* Intro */}
        <div className='bg-white shadow-sm rounded-sm p-4 sm:p-6 md:p-8'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text text-center mb-3 sm:mb-4'>
            Update Student Form
          </h2>

          {/* Horizontal line */}
          <hr className='border-t-2 border-gray-300 mb-4 w-full mx-auto' />

          <StudentForm data= {data?.data}/>

        </div>
      </div>
    </main>
  );
};

export default UpdateStudent;
