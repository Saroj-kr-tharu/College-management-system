import { useEffect, useState } from 'react';
import CourseList from '../../components/course/list';
import PageHeader from '../../components/header/page-header';
import SearchInput from './SearchInput';

const CoursePage = () => {
  const [tempInputValue, setTempInputValue] = useState('')
  const [inputValue, setInputValue] = useState('')

  useEffect(()=>{
    const interval = setTimeout(()=>{
      setInputValue(tempInputValue)
    },500)

    return()=> clearTimeout(interval)
  },[tempInputValue])

  console.log({inputValue})

  return (
    <main className='min-h-screen w-full p-0 flex flex-col gap-2'>
      
      {/* Page Header */}
      <PageHeader
        key='list-course'
        title='Course List'
        sub_title='All Courses'
        button_text='Add Course'
        link_to='/course/add'
      />

      {/* search inputField */}
      <SearchInput
      tempInputValue={tempInputValue}
      setTempInputValue={setTempInputValue}
      placeholder='Search courses' id='search'/>

      {/* Main content */}
      <div className='mx-auto w-full sm:px-0 lg:px-0'>
        
        {/* Intro */}
        <div className='bg-white shadow-sm rounded-sm p-4 sm:p-6 md:p-8'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text text-center mb-3 sm:mb-4'>
            Course List
          </h2>

          {/* Horizontal line */}
          <hr className='border-t-2 border-gray-300 mb-4 w-full mx-auto' />

          <CourseList inputValue={inputValue}/>

        </div>
      </div>
    </main>
  );
};

export default CoursePage;
